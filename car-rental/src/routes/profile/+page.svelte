<script>
	import { cancelBooking, fetchMyBookings, logout } from '$lib/api/client.js';
	import { onMount } from 'svelte';
	import { memberTier, setMemberTier, hydrateMemberTier } from '$lib/stores/memberTier.js';

	let { data } = $props();
	let bookings = $state([]);
	let loading = $state(true);
	let error = $state('');
	let cancellingBookingId = $state('');
	const tierLabels = {
		go: 'Dryve Go',
		beyond: 'Dryve Beyond',
		infinite: 'Dryve Infinite'
	};
	const accountActions = [
		{ title: 'Аккаунт', description: 'Профиль, контакты и документы' },
		{ title: 'Настройки', description: 'Уведомления и предпочтения' },
		{ title: 'Биллинг', description: 'Карты, чеки и способы оплаты' }
	];
	const tierOptions = [
		{
			id: 'go',
			label: 'Dryve Go',
			discount: '5%',
			access: 'Основной парк',
			description: 'Базовый уровень для повседневных поездок'
		},
		{
			id: 'beyond',
			label: 'Dryve Beyond',
			discount: '8%',
			access: 'Beyond+',
			description: 'Больше доступа и быстрее подтверждение'
		},
		{
			id: 'infinite',
			label: 'Dryve Infinite',
			discount: '12%',
			access: 'Infinite',
			description: 'Премиальный доступ и персональный сервис'
		}
	];
	const currentTier = $derived(tierOptions.find((tier) => tier.id === $memberTier) ?? tierOptions[0]);

	async function loadBookings() {
		loading = true;
		error = '';
		try {
			const payload = await fetchMyBookings();
			bookings = payload.items ?? [];
		} catch (loadError) {
			error = loadError.message;
		} finally {
			loading = false;
		}
	}

	async function onCancel(bookingId) {
		if (cancellingBookingId) return;
		cancellingBookingId = bookingId;
		error = '';
		try {
			await cancelBooking(bookingId);
			await loadBookings();
		} catch (cancelError) {
			error = cancelError?.message || 'Не удалось отменить бронирование. Попробуйте еще раз.';
		} finally {
			cancellingBookingId = '';
		}
	}

	async function onLogout() {
		await logout();
		window.location.href = '/';
	}

	onMount(() => {
		hydrateMemberTier();
		loadBookings();
	});

	function bookingStatusLabel(status) {
		if (status === 'cancelled') return 'Отменено';
		if (status === 'confirmed') return 'Подтверждено';
		if (status === 'pending') return 'Ожидает подтверждения';
		return 'Активно';
	}
</script>

<section class="profile-page">
	<span class="eyebrow">Dryve / Профиль</span>
	<h1 class="section-title">Личный кабинет</h1>

	<div class="profile-overview">
		<div class="profile-account">
			<div class="surface profile-head">
				<div class="profile-identity">
					<div class="avatar" aria-hidden="true">
						<i class="bi bi-person"></i>
					</div>
					<div class="profile-meta">

						<p class="profile-name">{data.user.name}</p>
						<p class="profile-email">{data.user.email}</p>
					</div>
				</div>
				<div class="profile-copy">
					<p>
						Сейчас активен <strong>{tierLabels[$memberTier]}</strong>: скидка {currentTier.discount},
						доступ {currentTier.access}.
					</p>
				</div>
				<div class="profile-actions">
					<button class="btn btn-secondary logout-btn" type="button" onclick={onLogout}>
						<i class="bi bi-box-arrow-right"></i>
						Выйти
					</button>
				</div>
			</div>

			<div class="surface account-menu">
				<div class="account-menu-head">
					<h3>Разделы профиля</h3>
					<p>Заглушки будущих настроек личного кабинета.</p>
				</div>
				{#each accountActions as action}
					<button class="account-action" type="button" disabled>
						<span>
							<strong>{action.title}</strong>
							<small>{action.description}</small>
						</span>
						<strong>Скоро</strong>
					</button>
				{/each}
			</div>
		</div>

		<div class="surface loyalty-panel">
			<div class="loyalty-panel-head">
				<h2>Выбор уровня</h2>
				<p class="loyalty-hint">
					В демо уровень можно переключить вручную. Скидка и доступ сразу применятся в каталоге.
				</p>
			</div>

			<div class="tier-switcher" role="radiogroup" aria-label="Выбор уровня лояльности">
				{#each tierOptions as tier}
					<button
						class="tier-option"
						class:active-tier={$memberTier === tier.id}
						type="button"
						role="radio"
						aria-checked={$memberTier === tier.id}
						onclick={() => setMemberTier(/** @type {'go' | 'beyond' | 'infinite'} */ (tier.id))}
					>
						<span class="tier-option-top">
							<strong>{tier.label}</strong>
							<em>{tier.discount}</em>
						</span>
						<span>{tier.description}</span>
						<small>Доступ: {tier.access}</small>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<div class="bookings-head">
		<h2>Мои бронирования</h2>
		<p>Здесь отображаются актуальные поездки и история отмен.</p>
	</div>

	{#if loading}
		<div class="surface state">Загрузка бронирований...</div>
	{:else if error}
		<div class="surface state">{error}</div>
	{:else if !bookings.length}
		<div class="surface state">Пока нет бронирований. Выберите автомобиль в каталоге.</div>
	{:else}
		<div class="card-grid">
			{#each bookings as booking}
				<article class="surface booking">
					<div class="booking-top">
						<div>
							<h3>{booking.carName}</h3>
							<p class="booking-dates">{booking.from} - {booking.to}</p>
						</div>
						<span class="status-chip" class:status-cancelled={booking.status === 'cancelled'}>
							{bookingStatusLabel(booking.status)}
						</span>
					</div>
					<div class="booking-meta">
						<p><i class="bi bi-calendar3"></i> {booking.days} дн.</p>
						<p><i class="bi bi-wallet2"></i> {booking.total.toLocaleString('ru-RU')} ₽</p>
					</div>
					<div class="booking-actions">
						{#if booking.status !== 'cancelled'}
							<button
								class="btn btn-secondary"
								type="button"
								disabled={cancellingBookingId === booking.id}
								onclick={() => onCancel(booking.id)}
							>
								{cancellingBookingId === booking.id ? 'Отмена...' : 'Отменить'}
							</button>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	{/if}
</section>

<style>
	.profile-page {
		display: grid;
		gap: var(--space-5);
	}

	.profile-overview {
		display: grid;
		grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
		gap: var(--space-4);
	}

	.profile-account {
		display: grid;
		gap: var(--space-3);
	}

	.profile-head {
		padding: var(--space-5);
		display: grid;
		grid-template-columns: minmax(220px, auto) minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--space-4);
		min-height: 100%;
	}

	.profile-head p {
		margin: 0;
	}

	.avatar {
		width: 3.4rem;
		height: 3.4rem;
		display: grid;
		place-items: center;
		border: var(--border-base);
		border-radius: 50%;
		background: var(--accent-soft);
	}

	.profile-identity {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-width: 0;
	}

	.profile-meta {
		display: grid;
		gap: 0.2rem;
		min-width: 0;
	}



	.profile-name {
		font-size: var(--text-2);
		font-weight: 700;
		line-height: var(--line-tight);
	}

	.profile-email {
		font-size: var(--text-3);
		color: var(--text-secondary);
		line-height: var(--line-normal);
	}

	.profile-copy {
		display: grid;
		gap: 0.35rem;
		max-width: 44ch;
	}

	.profile-copy p {
		font-size: var(--text-5);
		color: var(--text-secondary);
		line-height: 1.4;
	}

	.profile-head .btn {
		flex-shrink: 0;
	}

	.profile-actions {
		display: grid;
		justify-items: end;
		gap: var(--space-2);
	}

	.logout-btn {
		min-width: 7.5rem;
	}

	.account-menu {
		padding: var(--space-4);
		display: grid;
		gap: var(--space-2);
	}

	.account-menu-head {
		margin-bottom: var(--space-1);
	}

	.account-menu-head h3 {
		margin: 0 0 0.25rem;
	}

	.account-menu-head p {
		margin: 0;
		font-size: var(--text-5);
		color: var(--text-secondary);
	}

	.account-action {
		width: 100%;
		min-height: 4.35rem;
		padding: var(--space-3) 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		border: 0;
		border-top: 1px solid color-mix(in oklab, var(--line-color) 55%, transparent);
		background: transparent;
		text-align: left;
		color: var(--text-primary);
		cursor: not-allowed;
		opacity: 1;
	}

	.account-action span {
		display: grid;
		gap: 0.15rem;
		align-content: center;
	}

	.account-action span strong {
		margin: 0;
		color: var(--text-primary);
		font-size: var(--text-4);
		letter-spacing: 0;
		text-transform: none;
	}

	.account-action small {
		color: var(--text-secondary);
		font-size: var(--text-5);
	}

	.account-action > strong {
		flex-shrink: 0;
		color: var(--accent-strong);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		line-height: 1;
	}

	.loyalty-panel {
		padding: var(--space-5);
		display: grid;
		gap: var(--space-4);
		min-height: 100%;
	}

	.loyalty-panel h2 {
		margin-bottom: 0;
	}

	.loyalty-hint {
		margin: var(--space-2) 0 0;
		font-size: var(--text-5);
		color: var(--text-secondary);
	}

	.tier-switcher {
		display: grid;
		gap: var(--space-3);
	}

	.tier-option {
		padding: var(--space-4);
		display: grid;
		gap: 0.45rem;
		border: var(--border-base);
		border-radius: var(--radius-md);
		background: var(--bg-surface);
		color: var(--text-primary);
		text-align: left;
		cursor: pointer;
		transition:
			border-color var(--motion-base) var(--easing-standard),
			background-color var(--motion-base) var(--easing-standard),
			outline-color var(--motion-base) var(--easing-standard);
	}

	.tier-option:hover,
	.tier-option:focus-visible {
		border-color: var(--accent-strong);
		background: color-mix(in oklab, var(--accent-soft) 26%, var(--bg-surface));
		outline: 2px solid color-mix(in oklab, var(--accent-strong) 26%, transparent);
		outline-offset: 1px;
	}

	.tier-option-top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.tier-option-top strong {
		font-size: var(--text-3);
	}

	.tier-option-top em {
		font-style: normal;
		font-size: var(--text-2);
		font-weight: 800;
		color: var(--accent-strong);
		line-height: 1;
	}

	.tier-option span:not(.tier-option-top),
	.tier-option small {
		color: var(--text-secondary);
		font-size: var(--text-5);
	}

	.tier-option.active-tier {
		border-color: var(--accent-strong);
		background: color-mix(in oklab, var(--accent-soft) 42%, var(--bg-surface));
		outline: 1px solid color-mix(in oklab, var(--accent-strong) 28%, transparent);
		outline-offset: -1px;
	}

	.bookings-head h2 {
		margin-bottom: 0.2rem;
	}

	.bookings-head p {
		margin: 0;
		color: var(--text-secondary);
	}

	.state {
		padding: var(--space-4);
		color: var(--text-secondary);
	}

	.booking {
		padding: var(--space-4);
		display: grid;
		gap: var(--space-2);
	}

	.booking-top {
		display: flex;
		justify-content: space-between;
		gap: var(--space-2);
		align-items: flex-start;
	}

	.booking h3 {
		margin: 0;
	}

	.booking-dates {
		margin: var(--space-1) 0 0;
		color: var(--text-secondary);
	}

	.status-chip {
		font-size: var(--text-5);
		font-weight: 700;
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		background: color-mix(in oklab, var(--accent-soft) 45%, var(--bg-surface));
		border: 1px solid color-mix(in oklab, var(--accent-strong) 30%, var(--line-color));
		color: color-mix(in oklab, var(--accent-strong) 82%, var(--text-primary));
		white-space: nowrap;
	}

	.status-chip.status-cancelled {
		color: color-mix(in oklab, var(--danger) 80%, var(--text-primary));
		border-color: color-mix(in oklab, var(--danger) 45%, var(--line-color));
		background: color-mix(in oklab, var(--danger) 15%, var(--bg-surface));
	}

	.booking-meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.booking-meta p {
		margin: 0;
		font-size: var(--text-5);
		color: var(--text-secondary);
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}

	.booking-actions {
		display: flex;
		justify-content: flex-end;
	}

	@media (max-width: 980px) {
		.profile-overview {
			grid-template-columns: 1fr;
		}

		.profile-head {
			grid-template-columns: 1fr;
			align-items: start;
		}

		.profile-actions {
			justify-items: start;
		}
	}

	@media (max-width: 720px) {
		.profile-head .btn,
		.logout-btn {
			width: 100%;
		}

		.booking-top {
			flex-direction: column;
		}
	}
</style>
