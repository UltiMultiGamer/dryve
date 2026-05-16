<script>
	import { cartItems } from '$lib/stores/cart.js';
	import { canAccessCar, memberTier } from '$lib/stores/memberTier.js';
	import { effectiveDailyRate, tierDiscountPercent } from '$lib/loyalty-pricing.js';
	import CarImage from '$lib/components/CarImage.svelte';

	let { car } = $props();
	let added = $state(false);
	let tierMessage = $state('');

	const segmentLabel = $derived(
		(
			{
				economy: 'ЭКОНОМ',
				comfort: 'КОМФОРТ',
				premium: 'ПРЕМИУМ',
				sport: 'СПОРТ'
			}[car.segment] ?? 'КОМФОРТ'
		)
	);

	const toneClass = $derived(`tone-${car.segment ?? 'comfort'}`);
	const vehicleClassUpper = $derived(String(car.class ?? '').toUpperCase());
	const lockRank = $derived(Number(car.memberRankRequired) || 0);

	const dailyDeal = $derived(effectiveDailyRate(car, $memberTier));
	const discountPct = $derived(tierDiscountPercent($memberTier));

	const carTags = $derived.by(() => {
		return [
			{ icon: 'bi bi-gear', text: car.transmission },
			{ icon: 'bi bi-people', text: `${car.seats} мест` },
			{ icon: 'bi bi-arrow-left-right', text: car.drive },
			{ icon: 'bi bi-car-front', text: car.body },
			{ icon: 'bi bi-fuel-pump', text: car.fuel },
			{ icon: 'bi bi-cpu', text: car.engine }
		];
	});

	function addToCart() {
		tierMessage = '';
		if (!canAccessCar(car)) {
			tierMessage =
				lockRank >= 2
					? 'Нужен уровень Dryve Infinite. Настройте в профиле (демо).'
					: 'Нужен уровень Dryve Beyond или выше. Настройте в профиле (демо).';
			return;
		}
		const result = cartItems.add(car);
		if (result && result.ok === false && result.reason === 'tier') {
			tierMessage = 'Нужен уровень Dryve Beyond или выше.';
			return;
		}
		added = true;
		setTimeout(() => {
			added = false;
		}, 1200);
	}
</script>

<article class={`surface car-card ${toneClass}`}>
	<button class="favorite-btn" type="button" aria-label="Добавить в избранное">
		<i class="bi bi-heart"></i>
	</button>
	<a class="image-link" href={`/cars/${car.id}`} aria-label={`Открыть ${car.name}`}>
		<CarImage src={car.image} alt={car.name} height="220px" eager={false} />
		<div class="pill-corner-tl">
			<span class="pill pill--class">{vehicleClassUpper}</span>
			<span class="pill pill--year">{car.year}</span>
		</div>
		<div class="pill-corner-bl">
			<span class="pill pill--segment">{segmentLabel}</span>
			{#if lockRank >= 2}
				<span class="pill pill--lock">ТОЛЬКО INFINITE</span>
			{:else if lockRank === 1}
				<span class="pill pill--lock">ТОЛЬКО BEYOND+</span>
			{/if}
		</div>
	</a>
	<div class="content">
		<div class="head">
			<div class="title-col">
				<h3>{car.name}</h3>
				{#if car.tags?.length}
					<p class="meta-tags">{(car.tags ?? []).join(' · ')}</p>
				{/if}
			</div>
			<div class="price-block">
				<span class="price-main">{dailyDeal.toLocaleString('ru-RU')} ₽/сутки</span>
				{#if dailyDeal < car.pricePerDay}
					<div class="price-deal">
						<span class="price-was">{car.pricePerDay.toLocaleString('ru-RU')} ₽</span>
						<span class="price-save">−{discountPct}%</span>
					</div>
				{/if}
			</div>
		</div>

		<div class="stats">
			<ul class="stats-row">
				{#each carTags as tag}
					<li><i class={tag.icon}></i>{tag.text}</li>
				{/each}
			</ul>
		</div>
		{#if tierMessage}
			<p class="tier-hint">{tierMessage}</p>
		{/if}
		<div class="actions">
			<a class="btn btn-secondary details-btn" href={`/cars/${car.id}`}>Подробнее</a>
			<button
				class={`btn cta-btn ${lockRank >= 2 ? 'btn-infinite-cta' : 'btn-primary'}`}
				type="button"
				onclick={addToCart}
			>
				{added ? 'Добавлено' : 'В корзину'}
			</button>
		</div>
	</div>
</article>

<style>
	.car-card {
		overflow: hidden;
		display: grid;
		position: relative;
	}

	.image-link {
		display: block;
		position: relative;
		border-bottom: var(--border-base);
	}

	.pill-corner-tl,
	.pill-corner-bl {
		position: absolute;
		left: 0.55rem;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem;
		z-index: 2;
		pointer-events: none;
		max-width: calc(100% - 3.5rem);
	}

	.pill-corner-tl {
		top: 0.55rem;
	}

	.pill-corner-bl {
		bottom: 0.55rem;
	}

	.pill {
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		line-height: 1.2;
	}

	.pill--class,
	.pill--year {
		border: 1px solid #9eb5a7;
		background: rgba(255, 255, 255, 1);
		color:rgb(22, 26, 24);
	}

	.pill--segment {
		border: 1px solid color-mix(in oklab, var(--card-accent, #3f9f68) 70%, #000 30%);
		background: color-mix(in oklab, var(--card-accent, #3f9f68) 88%, black 12%);
		color: #fff;
	}

	.pill--lock {
		border: 1px solid #4a2f6e;
		background: linear-gradient(120deg, #5b3da8, #3d2569);
		color: #fff;
	}

	.favorite-btn {
		position: absolute;
		top: var(--space-3);
		right: var(--space-3);
		width: 2rem;
		height: 2rem;
		display: grid;
		place-items: center;
		padding: 0;
		border: var(--border-base);
		border-radius: 999px;
		background: color-mix(in oklab, var(--bg-surface) 90%, white 10%);
		color: var(--text-primary);
		z-index: 3;
	}

	.favorite-btn i {
		line-height: 1;
		transform: translateY(0.5px);
	}

	.content {
		padding: var(--space-4);
		display: grid;
		gap: var(--space-2);
		grid-template-rows: auto 1fr;
	}

	.head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.title-col {
		min-width: 0;
	}

	h3 {
		margin: 0;
		font-size: var(--text-3);
	}

	.meta-tags {
		margin: 0.25rem 0 0;
		font-size: var(--text-5);
		color: var(--text-secondary);
		line-height: 1.3;
	}

	.price-block {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.12rem;
		text-align: right;
		flex-shrink: 0;
	}

	.price-deal {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: flex-end;
		gap: 0.35rem;
	}

	.price-main {
		font-size: var(--text-5);
		font-weight: 700;
		color: var(--accent-strong);
	}

	.price-was {
		font-size: 0.72rem;
		color: var(--text-secondary);
		text-decoration: line-through;
	}

	.price-save {
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--danger);
	}

	.stats {
		display: grid;
		gap: var(--space-2);
	}

	.stats-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		list-style: none;
		padding: 0;
		margin: 0;
		flex-wrap: wrap;
	}

	.stats-row li {
		display: inline-flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.35rem;
		font-size: var(--text-5);
		padding: 0.32rem 0.45rem;
		border: var(--border-base);
		border-radius: 999px;
		background: var(--bg-muted);
	}

	.actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-2);
		align-self: end;
	}

	.cta-btn {
		font-weight: 600;
	}

	.details-btn {
		background: #fff;
	}

	.tier-hint {
		margin: 0;
		font-size: var(--text-5);
		color: var(--danger);
	}

	.tone-economy {
		--card-accent: #3f9f68;
	}

	.tone-comfort {
		--card-accent: #2f78b7;
	}

	.tone-premium {
		--card-accent: #5b3da8;
	}

	.tone-sport {
		--card-accent: #b44a2a;
	}
</style>
