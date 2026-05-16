<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { login } from '$lib/api/client.js';

	let email = $state('demo@dryve.app');
	let password = $state('123456');
	let message = $state('');
	let loading = $state(false);
	let forgotOpen = $state(false);

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
	<div class="surface auth-card">
		<span class="eyebrow">Dryve / Вход</span>
		<h1>Войти в аккаунт</h1>
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
			<div class="surface forgot-box">
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
				<i class="bi bi-github"></i>
				GitHub
			</button>
		</div>

	</div>
</section>

<style>
	.auth-wrapper {
		display: grid;
		place-items: center;
		min-height: 60vh;
	}

	.auth-card {
		width: min(100%, 460px);
		padding: var(--space-5);
	}

	.intro {
		margin-bottom: var(--space-5);
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
		margin-block: var(--space-4);
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
		margin-bottom: var(--space-4);
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
</style>
