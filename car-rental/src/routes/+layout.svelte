<script>
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/design-system.css';
	import { page } from '$app/state';
	import { onNavigate } from '$app/navigation';
	import { logout } from '$lib/api/client.js';
	import AppNavbar from '$lib/components/AppNavbar.svelte';
	import AppFooter from '$lib/components/AppFooter.svelte';

	let { children, data } = $props();
	let pageKey = $derived(page.url.pathname + page.url.search);
	let forcedLoggedOut = $state(false);
	let session = $derived(forcedLoggedOut ? null : (data.sessionUser ?? null));

	onNavigate((navigation) => {
		if (!document.startViewTransition) {
			return;
		}

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	async function handleLogout() {
		await logout();
		forcedLoggedOut = true;
		window.location.href = '/';
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Dryve</title>
</svelte:head>

<div class="app-shell">
	<AppNavbar {session} onLogout={handleLogout} />

	<main class="container page-shell">
		{#key pageKey}
			<div class="page-transition">
				{@render children()}
			</div>
		{/key}
	</main>
	<AppFooter />
</div>

<style>
	.app-shell {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	main {
		flex: 1;
	}

	.page-transition {
		animation: page-enter var(--motion-slow) var(--easing-standard);
	}

	:global(::view-transition-old(root)),
	:global(::view-transition-new(root)) {
		animation-duration: 260ms;
		animation-timing-function: var(--easing-standard);
	}

	@keyframes page-enter {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

</style>
