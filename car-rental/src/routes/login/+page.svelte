<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { login } from '$lib/api/client.js';

	let email = $state('demo@dryve.app');
	let password = $state('123456');
	let message = $state('');
	let loading = $state(false);
	let forgotOpen = $state(false);
	const sideSlides = [
		{ image: '/images/generic/toyota_camry_2_2.webp', label: 'Город и трасса' },
		{ image: '/images/sports/porsche_911_1_1.webp', label: 'Выходные и эмоции' },
		{ image: '/images/luxury/rolls_royce_2_2.webp', label: 'Бизнес и премиум' }
	];

	async function submit(event) {
		event.preventDefault();
		message = '';
		loading = true;
		try {
			await login({ email, password });
			goto(page.url.searchParams.get('next') || '/profile');
		} catch (error) {
			message = error.message;
		} finally {
			loading = false;
		}
	}
</script>

<section class="auth-wrapper">
	<div class="auth-layout">
		<div class="auth-form-panel">
			<span class="eyebrow">Dryve / Вход</span>
			<h1 class="auth-title">Войти в аккаунт</h1>
			<p class="intro">Войдите, чтобы управлять бронированиями и корзиной.</p>

			<form onsubmit={submit} class="auth-form">
				<div class="field">
					<label for="email">Email</label>
					<input class="input" id="email" type="email" bind:value={email} required />
				</div>

				<div class="field">
					<label for="password">Пароль</label>
					<input class="input" id="password" type="password" bind:value={password} required />
				</div>

				{#if message}
					<p class="error">{message}</p>
				{/if}

				<button class="btn btn-primary" type="submit" disabled={loading}>
					{loading ? 'Входим...' : 'Войти'}
				</button>
			</form>

			<div class="auth-links">
				<a href="/login">Регистрация</a>
				<span></span>
				<button type="button" class="link-btn" onclick={() => (forgotOpen = !forgotOpen)}>Забыли пароль?</button>
			</div>

			{#if forgotOpen}
				<div class="forgot-box">
					<p>Сброс пароля в MVP пока не подключен.</p>
					<p>Для демо используйте:</p>
					<code>demo@dryve.app</code>
					<code>123456</code>
				</div>
			{/if}

			<div class="divider"><span>или</span></div>

			<div class="socials">
				<button class="btn btn-secondary" type="button" disabled>
					<i class="bi bi-google"></i>
					Google
				</button>
				<button class="btn btn-secondary" type="button" disabled>
					<i class="bi bi-apple"></i>
					Apple
				</button>
			</div>
		</div>

		<aside class="auth-side">
			<div class="auth-side-bg" aria-hidden="true">
				{#each sideSlides as slide, index}
					<div
						class="auth-side-slide"
						style={`--delay:${index * 5}s;--slide-image:url(${slide.image})`}
					></div>
				{/each}
			</div>
			<div class="auth-side-overlay"></div>
			<div class="auth-side-content">
				<h2>Личный кабинет Dryve</h2>
				<p>Бронирования, избранное и уровень лояльности в одном месте.</p>
			</div>
		</aside>
	</div>
</section>

<style>
	.auth-wrapper {
		display: block;
	}

	.auth-layout {
		width: 100%;
		margin-inline: auto;
		display: grid;
		grid-template-columns: minmax(360px, 1fr) minmax(320px, 0.9fr);
		gap: 0;
		align-items: stretch;
		border: var(--border-base);
		border-radius: var(--radius-md);
		background: var(--bg-surface);
		overflow: hidden;
	}

	.auth-form-panel {
		padding: var(--space-4);
		display: grid;
		gap: var(--space-2);
	}

	.auth-title {
		margin-bottom: var(--space-1);
		font-size: clamp(1.45rem, 2.2vw, 2rem);
	}

	.auth-side {
		border-left: var(--border-base);
		position: relative;
		min-height: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: flex-start;
		padding: var(--space-4);
		background: color-mix(in oklab, var(--bg-muted) 46%, var(--bg-surface));
	}

	.auth-side-bg {
		position: absolute;
		inset: 0;
	}

	.auth-side-slide {
		position: absolute;
		inset: 0;
		opacity: 0;
		background-image: var(--slide-image);
		background-size: cover;
		background-position: center;
		animation: side-cycle 15s linear infinite;
		animation-delay: var(--delay);
	}

	.auth-side-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(10, 24, 18, 0.22), rgba(10, 24, 18, 0.68));
	}

	.auth-side-content {
		position: relative;
		z-index: 1;
		max-width: 30ch;
	}

	.auth-side h2 {
		margin: 0;
		font-size: var(--text-3);
		color: #fff;
	}

	.auth-side p {
		margin: var(--space-2) 0 0;
		color: color-mix(in oklab, #fff 85%, var(--accent-soft) 15%);
	}

	.intro {
		margin: 0 0 var(--space-3);
	}

	.auth-form {
		display: grid;
		gap: var(--space-3);
	}

	.auth-links {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		margin-block: var(--space-3);
		font-size: var(--text-5);
		color: var(--text-secondary);
	}

	.auth-links a {
		text-decoration: none;
	}

	.link-btn {
		background: none;
		border: 0;
		padding: 0;
		color: inherit;
		cursor: pointer;
		text-decoration: underline;
	}

	.auth-links span {
		width: 1px;
		height: 1rem;
		background: var(--line-color);
	}

	.divider {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
		color: var(--text-secondary);
		font-size: var(--text-5);
	}

	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--line-color);
	}

	.socials {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-2);
	}

	.forgot-box {
		border: var(--border-base);
		border-radius: var(--radius-sm);
		background: color-mix(in oklab, var(--bg-muted) 24%, var(--bg-surface));
		padding: var(--space-3);
		display: grid;
		gap: var(--space-2);
		font-size: var(--text-5);
		color: var(--text-secondary);
	}

	code {
		color: var(--text-primary);
	}

	.error {
		margin: 0;
		color: var(--danger);
	}

	@media (max-width: 880px) {
		.auth-layout {
			grid-template-columns: 1fr;
		}

		.auth-side {
			border-left: 0;
			border-top: var(--border-base);
			min-height: 240px;
		}
	}

	@keyframes side-cycle {
		0%,
		24% {
			opacity: 0;
		}
		30%,
		54% {
			opacity: 1;
		}
		60%,
		100% {
			opacity: 0;
		}
	}
</style>
