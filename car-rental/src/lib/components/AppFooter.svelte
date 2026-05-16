<script>
	import AppBrand from '$lib/components/AppBrand.svelte';
	import { page } from '$app/state';

	function isActive(path) {
		return page.url.pathname === path || page.url.pathname.startsWith(`${path}/`);
	}
</script>

<footer class="footer">
	<div class="container footer-grid">
		<div>
			<div class="brand-wrap">
				<AppBrand href="/" large />
			</div>
			<p>Сервис аренды и проката автомобилей.</p>
			<p>Василенко Ф.А.</p>
		</div>

		<nav aria-label="Нижняя навигация">
			<a href="/cars" class:active-link={isActive('/cars')} aria-current={isActive('/cars') ? 'page' : undefined}>Каталог</a>
			<a
				href="/profile"
				class:active-link={isActive('/profile')}
				aria-current={isActive('/profile') ? 'page' : undefined}
			>
				Бронирования
			</a>
			<a href="/about" class:active-link={isActive('/about')} aria-current={isActive('/about') ? 'page' : undefined}>О сервисе</a>
		</nav>

		<div class="meta">
			<span>Demo MVP</span>
			<span>SvelteKit + Vite</span>
		</div>
	</div>
</footer>

<style>
	.footer {
		border-top: var(--border-base);
		background: color-mix(in oklab, var(--bg-primary) 92%, white 8%);
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: var(--space-5);
		padding-block: var(--space-5);
		align-items: start;
	}

	.brand-wrap {
		margin-bottom: var(--space-2);
	}

	.brand-wrap :global(.app-brand) {
		font-size: 1.65rem;
	}

	.brand-wrap :global(.app-brand.large) {
		font-size: 1.75rem;
	}

	p {
		max-width: 34ch;
		margin: 0;
	}

	nav,
	.meta {
		display: grid;
		gap: var(--space-2);
		color: var(--text-secondary);
	}

	nav a {
		text-decoration: none;
		padding: 0.25rem 0;
		color: inherit;
		border-bottom: 1px solid transparent;
		transition:
			border-color var(--motion-base) var(--easing-standard),
			color var(--motion-base) var(--easing-standard);
	}

	nav a:hover,
	nav a:focus-visible {
		color: var(--text-primary);
		border-bottom-color: var(--line-color);
	}

	nav a.active-link {
		color: var(--text-primary);
		border-bottom-color: var(--accent-strong);
	}

	@media (max-width: 760px) {
		.footer-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
