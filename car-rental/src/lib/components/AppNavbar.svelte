<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { cartItems } from '$lib/stores/cart.js';
	import { hydrateMemberTier } from '$lib/stores/memberTier.js';
	import { DropdownMenu } from 'bits-ui';
	import AppBrand from '$lib/components/AppBrand.svelte';

	let { session = null, onLogout = null } = $props();

	const navItems = [
		{ href: '/cars', label: 'Каталог' }
	];

	function isActive(path) {
		return page.url.pathname === path || page.url.pathname.startsWith(`${path}/`);
	}

	onMount(() => {
		cartItems.hydrate();
		hydrateMemberTier();
	});
</script>

<header class="app-header">
	<div class="container nav-grid">
		<div class="left">
			<AppBrand href="/" large />
			<nav aria-label="Основная навигация">
				<ul class="nav-list">
					{#each navItems as item}
						<li>
							<a
								href={item.href}
								class={`catalog-btn ${isActive(item.href) ? 'is-active' : ''}`}
								aria-current={isActive(item.href) ? 'page' : undefined}
							>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>

		<form class="search-form" method="GET" action="/cars">
			<i class="bi bi-search" aria-hidden="true"></i>
			<input
				class="input nav-search"
				type="search"
				name="search"
				value={page.url.searchParams.get('search') ?? ''}
				placeholder="Поиск авто по модели или классу"
				aria-label="Поиск авто по модели или классу"
			/>
		</form>

		<div class="actions">
			<a
				class={`icon-btn ${isActive('/favorites') ? 'is-active' : ''}`}
				href="/favorites"
				aria-label="Избранное"
				aria-current={isActive('/favorites') ? 'page' : undefined}
			>
				<i class="bi bi-heart"></i>
			</a>
			<a
				class={`icon-btn cart-btn ${isActive('/cart') ? 'is-active' : ''}`}
				href="/cart"
				aria-label="Корзина"
				aria-current={isActive('/cart') ? 'page' : undefined}
			>
				<i class="bi bi-bag"></i>
				{#if $cartItems.length}
					<span>{$cartItems.length}</span>
				{/if}
			</a>
			{#if session}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						class={`icon-btn ${isActive('/profile') ? 'is-active' : ''}`}
						aria-label="Аккаунт"
						aria-current={isActive('/profile') ? 'page' : undefined}
					>
						<i class="bi bi-person"></i>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="account-content" align="end" sideOffset={8}>
						<DropdownMenu.Item
							class="account-item"
							onSelect={() => {
								window.location.href = '/profile';
							}}
						>
							<i class="bi bi-person"></i>
							Профиль
						</DropdownMenu.Item>
						<DropdownMenu.Separator class="account-separator" />
						<DropdownMenu.Item
							class="account-item"
							onSelect={async () => {
								await onLogout?.();
							}}
						>
							<i class="bi bi-box-arrow-right"></i>
							Выйти
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{:else}
				<a
					class={`icon-btn ${isActive('/login') ? 'is-active' : ''}`}
					href="/login"
					aria-label="Войти"
					aria-current={isActive('/login') ? 'page' : undefined}
				>
					<i class="bi bi-person"></i>
				</a>
			{/if}
		</div>
	</div>
</header>

<style>
	.app-header {
		position: sticky;
		top: 0;
		z-index: var(--z-nav);
		border-bottom: var(--border-light);
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(16px);
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.02);
		transition: background var(--motion-base) var(--easing-standard);
	}

	.nav-grid {
		display: grid;
		grid-template-columns: max-content minmax(360px, 1fr) auto;
		align-items: center;
		gap: var(--space-4);
		padding-block: var(--space-3);
	}

	.left {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.nav-list {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-list a {
		padding: 0.45rem 0.7rem;
		border-radius: var(--radius-sm);
		border: var(--border-base);
		text-decoration: none;
		color: var(--text-secondary);
		background: var(--bg-surface);
		transition:
			background-color var(--motion-base) var(--easing-standard),
			border-color var(--motion-base) var(--easing-standard),
			color var(--motion-base) var(--easing-standard);
	}

	.nav-list a:hover,
	.nav-list a:focus-visible {
		border-color: var(--text-primary);
		color: var(--text-primary);
		background: var(--bg-muted);
	}

	.nav-list a.catalog-btn {
		background: var(--accent-strong);
		border-color: var(--accent-strong);
		color: #fff;
		font-weight: 600;
	}

	.nav-list a.is-active {
		border-color: var(--text-primary);
	}

	.nav-list a.catalog-btn:hover,
	.nav-list a.catalog-btn:focus-visible,
	.nav-list a.catalog-btn.is-active {
		background: var(--accent);
		border-color: var(--accent);
		color: #fff;
	}

	.search-form {
		position: relative;
		width: 100%;
	}

	.search-form i {
		position: absolute;
		left: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-secondary);
	}

	.nav-search {
		padding-left: 2rem;
	}

	.actions {
		display: flex;
		align-items: center;
		justify-self: end;
		gap: var(--space-2);
	}

	:global(.icon-btn) {
		position: relative;
		width: 2.7rem;
		height: 2.7rem;
		display: inline-grid;
		place-items: center;
		appearance: none;
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		border: var(--border-base);
		border-radius: var(--radius-sm);
		background: var(--bg-surface);
		text-decoration: none;
		color: var(--text-primary);
		font-size: 1.15rem;
		line-height: 1;
		font-family: inherit;
		cursor: pointer;
		transition:
			background-color var(--motion-base) var(--easing-standard),
			border-color var(--motion-base) var(--easing-standard);
	}

	:global(.icon-btn:hover),
	:global(.icon-btn:focus-visible) {
		border-color: var(--text-primary);
		background: color-mix(in oklab, var(--bg-surface) 84%, var(--bg-muted) 16%);
		outline: none;
	}

	:global(.icon-btn.is-active) {
		border-color: var(--accent-strong);
		background: color-mix(in oklab, var(--accent-soft) 30%, var(--bg-surface) 70%);
	}

	:global(.account-content) {
		min-width: 190px;
		border: var(--border-base);
		border-radius: var(--radius-sm);
		background: var(--bg-surface);
		padding: var(--space-1);
		animation: account-enter var(--motion-base) var(--easing-standard);
	}

	:global(.account-item) {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: 0.55rem 0.65rem;
		border-radius: calc(var(--radius-sm) - 2px);
		cursor: pointer;
	}

	:global(.account-item[data-highlighted]) {
		background: var(--bg-muted);
	}

	:global(.account-separator) {
		height: 1px;
		margin: var(--space-1) 0;
		background: var(--line-color);
	}

	.cart-btn span {
		position: absolute;
		top: -0.35rem;
		right: -0.35rem;
		min-width: 1rem;
		height: 1rem;
		display: inline-grid;
		place-items: center;
		border-radius: 999px;
		background: var(--accent);
		color: #fff;
		font-size: 0.65rem;
	}

	@media (max-width: 1040px) {
		.nav-grid {
			grid-template-columns: 1fr;
			gap: var(--space-3);
		}

		.left {
			justify-content: space-between;
			flex-wrap: wrap;
		}

		.actions {
			justify-self: start;
		}
	}

	@keyframes account-enter {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
