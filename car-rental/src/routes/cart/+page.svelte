<script>
	import { onMount } from 'svelte';
	import { cartItems } from '$lib/stores/cart.js';
	import { hydrateMemberTier } from '$lib/stores/memberTier.js';
	import CarImage from '$lib/components/CarImage.svelte';

	function defaultBookingRange() {
		const fromDate = new Date();
		const toDate = new Date();
		toDate.setDate(fromDate.getDate() + 1);
		const from = fromDate.toISOString().slice(0, 10);
		const to = toDate.toISOString().slice(0, 10);
		return `from=${from}&to=${to}`;
	}

	const rangeQuery = defaultBookingRange();

	onMount(() => {
		cartItems.hydrate();
		hydrateMemberTier();
	});
</script>

<section>
	<span class="eyebrow">Dryve / Корзина</span>
	<h1 class="section-title">Корзина бронирований</h1>

	{#if !$cartItems.length}
		<div class="surface page">
			<p>Корзина пуста. Добавьте автомобиль из каталога, чтобы перейти к оформлению аренды.</p>
			<a class="btn btn-primary" href="/cars">Перейти в каталог</a>
		</div>
	{:else}
		<p class="cart-note">Оформление выполняется по одному автомобилю за раз.</p>
		<div class="items">
			{#each $cartItems as car}
				<article class="surface cart-item">
					<a href={`/cars/${car.id}`} class="image-link">
						<CarImage src={car.image} alt={car.name} height="100px" eager={false} />
					</a>
					<div>
						<h2>{car.name}</h2>
						<p>{car.class} · {car.transmission}</p>
						<p>{car.pricePerDay.toLocaleString('ru-RU')} ₽/сутки</p>
					</div>
					<div class="item-actions">
						<a class="btn btn-primary" href={`/book?carId=${car.id}&${rangeQuery}`}>Оформить</a>
						<button class="btn btn-secondary" type="button" onclick={() => cartItems.remove(car.id)}>
							Удалить
						</button>
					</div>
				</article>
			{/each}
		</div>
		<div class="surface summary-inline">
			<button class="btn btn-secondary" type="button" onclick={() => cartItems.clear()}>
				Очистить корзину
			</button>
		</div>
	{/if}
</section>

<style>
	.page {
		padding: var(--space-5);
		display: grid;
		gap: var(--space-3);
	}

	.cart-note {
		margin: 0 0 var(--space-3);
		font-size: var(--text-5);
		color: var(--text-secondary);
	}

	.items {
		display: grid;
		gap: var(--space-3);
	}

	.cart-item {
		display: grid;
		grid-template-columns: 160px 1fr auto;
		gap: var(--space-4);
		padding: var(--space-3);
		align-items: center;
	}

	.image-link {
		display: block;
		border-radius: var(--radius-sm);
		overflow: hidden;
		border: var(--border-base);
	}

	.image-link :global(.car-image-frame) {
		height: 100px !important;
	}

	h2 {
		margin-bottom: var(--space-2);
		font-size: var(--text-3);
	}

	p {
		margin-bottom: var(--space-2);
	}

	.item-actions,
	.summary-inline {
		display: grid;
		gap: var(--space-2);
	}

	.summary-inline {
		margin-top: var(--space-3);
		padding: var(--space-3);
		background: color-mix(in oklab, var(--bg-muted) 45%, var(--bg-surface) 55%);
	}

	@media (max-width: 900px) {
		.cart-item {
			grid-template-columns: 1fr;
		}
	}
</style>
