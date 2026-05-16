<script>
	import CarCard from '$lib/components/CarCard.svelte';
	import CarsFilterSidebar from '$lib/components/CarsFilterSidebar.svelte';
	import AppSelect from '$lib/components/AppSelect.svelte';

	let { data } = $props();
	let sortValue = $state('popular');
	const sortItems = [
		{ value: 'popular', label: 'Популярные' },
		{ value: 'price-asc', label: 'Цена по возрастанию' },
		{ value: 'price-desc', label: 'Цена по убыванию' },
		{ value: 'name', label: 'По названию' }
	];

	const items = $derived.by(() => {
		const list = [...data.items];
		if (sortValue === 'price-asc') return list.sort((a, b) => a.pricePerDay - b.pricePerDay);
		if (sortValue === 'price-desc') return list.sort((a, b) => b.pricePerDay - a.pricePerDay);
		if (sortValue === 'name') return list.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
		return list;
	});
</script>

<section>
	<span class="eyebrow">Dryve / Каталог</span>
	<h1 class="section-title">Автомобили для аренды</h1>

	<div class="catalog-layout">
		<aside>
			<CarsFilterSidebar active={data.active} filters={data.filters} />
		</aside>

		<div class="catalog-content">
			<div class="surface toolbar">
				<p class="result-meta">Найдено автомобилей: {data.total}</p>
				<div class="sort-box">
					<AppSelect id="sort-trigger" items={sortItems} bind:value={sortValue} />
				</div>
			</div>

			<div class="card-grid">
				{#if items.length}
					{#each items as car}
						<CarCard {car} />
					{/each}
				{:else}
					<div class="surface empty">По этим фильтрам ничего не найдено. Попробуйте смягчить условия.</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.catalog-layout {
		display: grid;
		gap: var(--space-4);
		grid-template-columns: 280px minmax(0, 1fr);
		align-items: start;
	}

	.catalog-content {
		min-width: 0;
	}

	.toolbar {
		padding: var(--space-3) var(--space-4);
		margin-bottom: var(--space-4);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.result-meta {
		margin: 0;
	}

	.sort-box {
		display: grid;
		min-width: 220px;
	}

	.empty {
		padding: var(--space-5);
	}

	.card-grid {
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: var(--space-5);
	}

	@media (max-width: 980px) {
		.catalog-layout {
			grid-template-columns: 1fr;
		}
	}
</style>
