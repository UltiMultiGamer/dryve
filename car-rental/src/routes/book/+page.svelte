<script>
	import { createBooking } from '$lib/api/client.js';
	import { cartItems } from '$lib/stores/cart.js';
	import { goto } from '$app/navigation';
	import AppDateRangePicker from '$lib/components/AppDateRangePicker.svelte';
	import CarImage from '$lib/components/CarImage.svelte';
	import { canAccessCar, memberTier } from '$lib/stores/memberTier.js';
	import { effectiveDailyRate, tierDiscountPercent } from '$lib/loyalty-pricing.js';

	let { data } = $props();

	let from = $state('');
	let to = $state('');
	let errorMessage = $state('');
	let successMessage = $state('');
	let loading = $state(false);
	const todayIso = new Date().toISOString().slice(0, 10);

	const canRent = $derived(data.car ? canAccessCar(data.car) : false);
	const lockRank = $derived(data.car ? Number(data.car.memberRankRequired) || 0 : 0);
	const dailyRate = $derived(data.car ? effectiveDailyRate(data.car, $memberTier) : 0);
	const discountPct = $derived(tierDiscountPercent($memberTier));

	$effect(() => {
		if (!from) from = data.from || new Date().toISOString().slice(0, 10);
		if (!to) to = data.to || new Date().toISOString().slice(0, 10);
	});

	const days = $derived.by(() => {
		const start = new Date(from);
		const end = new Date(to);
		const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
		return Number.isFinite(diff) && diff > 0 ? diff : 1;
	});

	const total = $derived.by(() => {
		if (!data.car) return 0;
		return days * dailyRate;
	});

	async function submit(event) {
		event.preventDefault();
		if (!data.car) {
			errorMessage = 'Выберите автомобиль из каталога.';
			return;
		}
		if (!canRent) {
			errorMessage =
				lockRank >= 2
					? 'Этот автомобиль доступен с уровня Dryve Infinite. Откройте профиль и повысьте уровень (демо).'
					: 'Этот автомобиль доступен с уровня Dryve Beyond и выше. Откройте профиль и повысьте уровень (демо).';
			return;
		}
		if (!from || !to) {
			errorMessage = 'Выберите даты начала и окончания аренды.';
			return;
		}
		if (new Date(to) < new Date(from)) {
			errorMessage = 'Дата окончания не может быть раньше даты начала.';
			return;
		}

		errorMessage = '';
		successMessage = '';
		loading = true;
		try {
			await createBooking({
				carId: data.car.id,
				from,
				to
			});
			cartItems.remove(data.car.id);
			successMessage = 'Бронирование успешно создано.';
			setTimeout(() => {
				goto('/profile');
			}, 600);
		} catch (error) {
			errorMessage = error.message;
		} finally {
			loading = false;
		}
	}
</script>

<section>
	<span class="eyebrow">Dryve / Бронирование</span>
	<h1 class="section-title">Оформление аренды</h1>

	{#if !data.car}
		<div class="surface state">Автомобиль не выбран. Перейдите в <a href="/cars">каталог</a>.</div>
	{:else}
		<div class="grid">
			<article class="surface summary">
				<CarImage src={data.car.image} alt={data.car.name} height="200px" eager={true} />
				<div class="summary-body">
					<h2>{data.car.name}</h2>
					<p>{data.car.class} · {data.car.transmission}</p>
					<p class="rate-line">
						<span class="rate-main">{dailyRate.toLocaleString('ru-RU')} ₽/сутки</span>
						{#if data.car && dailyRate < data.car.pricePerDay}
							<span class="rate-was">{data.car.pricePerDay.toLocaleString('ru-RU')} ₽</span>
							<span class="rate-save">−{discountPct}%</span>
						{/if}
					</p>
				</div>
			</article>

			<form class="surface form" onsubmit={submit}>
				<AppDateRangePicker
					id="booking-period"
					label="Период аренды"
					min={todayIso}
					required={true}
					startName="from"
					endName="to"
					bind:start={from}
					bind:end={to}
				/>
				<div class="surface total">
					<div>
						<p class="total-label">Дней аренды</p>
						<p class="total-value">{days}</p>
					</div>
					<div>
						<p class="total-label">Итого</p>
						<p class="total-value">{total.toLocaleString('ru-RU')} ₽</p>
					</div>
				</div>
				<p class="period-line">Период: {from} - {to} ({days} дн.)</p>
				<p class="rate-line-detail">
					Ставка: {dailyRate.toLocaleString('ru-RU')} ₽/сутки
					{#if data.car && dailyRate < data.car.pricePerDay}
						(вместо {data.car.pricePerDay.toLocaleString('ru-RU')} ₽, скидка {discountPct}%)
					{/if}
				</p>
				{#if !canRent}
					<p class="tier-note">
						{#if lockRank >= 2}
							Бронирование недоступно: нужен уровень <strong>Dryve Infinite</strong>.
						{:else}
							Бронирование недоступно: нужен уровень <strong>Dryve Beyond</strong> или выше.
						{/if}
					</p>
				{/if}
				<button class="btn btn-primary" type="submit" disabled={loading || !canRent}>
					{loading ? 'Создание...' : 'Подтвердить бронь'}
				</button>
				<div class="form-status" aria-live="polite">
					{#if errorMessage}
						<p class="error"><i class="bi bi-exclamation-circle"></i>{errorMessage}</p>
					{:else if successMessage}
						<p class="success"><i class="bi bi-check2-circle"></i>{successMessage}</p>
					{/if}
				</div>
			</form>
		</div>
	{/if}
</section>

<style>
	.grid {
		display: grid;
		gap: var(--space-4);
	}

	.summary {
		overflow: hidden;
	}

	.tier-note {
		margin: 0 0 var(--space-2);
		font-size: var(--text-5);
		color: var(--danger);
	}

	.rate-line {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.45rem;
		margin: 0;
	}

	.rate-main {
		font-weight: 700;
		color: var(--accent-strong);
	}

	.rate-was {
		font-size: 0.85em;
		text-decoration: line-through;
		color: var(--text-secondary);
	}

	.rate-save {
		font-size: 0.8em;
		font-weight: 700;
		color: var(--danger);
	}

	.summary :global(.car-image-frame) {
		border-bottom: var(--border-base);
	}

	.summary-body {
		padding: var(--space-4);
	}

	.form {
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		height: 100%;
	}

	.total {
		padding: var(--space-3) var(--space-4);
		display: grid;
		grid-template-columns: 1fr auto;
		gap: var(--space-3);
		background: linear-gradient(120deg, var(--bg-muted), color-mix(in oklab, var(--accent-soft) 45%, #fff 55%));
	}

	.total p {
		margin: 0;
	}

	.total-label {
		font-size: var(--text-5);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.total-value {
		color: var(--text-primary);
		font-size: var(--text-3);
		font-weight: 700;
	}

	.period-line {
		margin: 0;
		font-size: var(--text-5);
		color: var(--text-secondary);
	}

	.rate-line-detail {
		margin: 0;
		font-size: var(--text-5);
		color: var(--text-secondary);
	}

	.form .btn[type='submit'] {
		margin-top: auto;
	}

	.error {
		margin: 0;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		color: var(--danger);
	}

	.success {
		margin: 0;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		color: var(--accent-strong);
	}

	.form-status {
		min-height: 1.75rem;
	}

	.state {
		padding: var(--space-5);
	}

	@media (min-width: 900px) {
		.grid {
			grid-template-columns: 1.1fr 0.9fr;
			align-items: stretch;
		}
	}

	@media (max-width: 560px) {
		.total {
			grid-template-columns: 1fr;
		}
	}
</style>
