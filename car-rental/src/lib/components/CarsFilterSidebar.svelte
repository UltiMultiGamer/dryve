<script>
	import AppSelect from '$lib/components/AppSelect.svelte';
	import { Slider } from 'bits-ui';

	let { active, filters } = $props();

	let classValue = $state('all');
	let transmissionValue = $state('all');
	let bodyValue = $state('all');
	let driveValue = $state('all');
	let fuelValue = $state('all');
	let seatsMinValue = $state(0);
	let yearMinValue = $state(0);
	let priceMaxValue = $state(0);
	let lastActiveKey = $state('');

	const classItems = $derived([
		{ value: 'all', label: 'Любой класс' },
		...(filters.classes ?? []).map((item) => ({ value: item, label: item }))
	]);

	const transmissionItems = $derived([
		{ value: 'all', label: 'Любая коробка' },
		...(filters.transmissions ?? []).map((item) => ({ value: item, label: item }))
	]);

	const bodyItems = $derived([
		{ value: 'all', label: 'Любой кузов' },
		...(filters.bodies ?? []).map((item) => ({ value: item, label: item }))
	]);

	const driveItems = $derived([
		{ value: 'all', label: 'Любой привод' },
		...(filters.drives ?? []).map((item) => ({ value: item, label: item }))
	]);

	const fuelItems = $derived([
		{ value: 'all', label: 'Любое топливо' },
		...(filters.fuels ?? []).map((item) => ({ value: item, label: item }))
	]);

	const seatsSorted = $derived((filters.seats ?? []).slice().sort((a, b) => a - b));
	const yearsSorted = $derived((filters.years ?? []).slice().sort((a, b) => a - b));

	const seatsFleetMin = $derived.by(() => {
		const n = Number(filters.seatsFleetMin);
		if (Number.isFinite(n)) return n;
		return seatsSorted[0] ?? 2;
	});

	/** Bits UI only exposes draggable steps in [min,max]; min===max yields one step and a stuck thumb. */
	const seatsSliderBounds = $derived.by(() => {
		const sorted = seatsSorted;
		let smin = Number(filters.seatsSlider?.min);
		let smax = Number(filters.seatsSlider?.max);
		if (!Number.isFinite(smin)) smin = sorted[0] ?? 2;
		if (!Number.isFinite(smax)) smax = sorted[sorted.length - 1] ?? 9;
		if (smax <= smin) {
			smin = 2;
			smax = 9;
		}
		return { min: smin, max: smax };
	});
	const seatsSliderMin = $derived(seatsSliderBounds.min);
	const seatsSliderMax = $derived(seatsSliderBounds.max);
	const yearMin = $derived(yearsSorted.length ? yearsSorted[0] : 2000);
	const yearMax = $derived(yearsSorted.length ? yearsSorted[yearsSorted.length - 1] : new Date().getFullYear());
	const priceMin = $derived(filters.priceRange?.min ?? 0);
	const priceMax = $derived(filters.priceRange?.max ?? 0);

	$effect(() => {
		const currentActiveKey = [
			active.class,
			active.transmission,
			active.body,
			active.drive,
			active.fuel,
			active.seatsMin,
			active.yearMin,
			active.priceMax
		].join('|');
		if (currentActiveKey === lastActiveKey) return;
		lastActiveKey = currentActiveKey;

		classValue = active.class || 'all';
		transmissionValue = active.transmission || 'all';
		bodyValue = active.body || 'all';
		driveValue = active.drive || 'all';
		fuelValue = active.fuel || 'all';
		{
			const parsed =
				active.seatsMin === '' || active.seatsMin == null ? NaN : Number(active.seatsMin);
			const fromUrl = Number.isFinite(parsed) ? parsed : seatsFleetMin;
			seatsMinValue = Math.min(seatsSliderMax, Math.max(seatsSliderMin, fromUrl));
		}
		yearMinValue = Number(active.yearMin) || yearMin;
		priceMaxValue = Number(active.priceMax) || priceMax;
	});

</script>

<form class="surface filters" method="GET">
	<div class="top-row">
		<h2>Фильтры</h2>
		<a href="/cars" class="clear">Сбросить</a>
	</div>

	<div class="field">
		<label for="class-select-trigger">Класс</label>
		<AppSelect
			id="class-select-trigger"
			name="class"
			items={classItems}
			bind:value={classValue}
			placeholder="Любой класс"
			search={true}
		/>
	</div>

	<div class="field">
		<label for="transmission-select-trigger">Коробка</label>
		<AppSelect
			id="transmission-select-trigger"
			name="transmission"
			items={transmissionItems}
			bind:value={transmissionValue}
			placeholder="Любая коробка"
		/>
	</div>

	<div class="field">
		<label for="body-select-trigger">Кузов</label>
		<AppSelect
			id="body-select-trigger"
			name="body"
			items={bodyItems}
			bind:value={bodyValue}
			placeholder="Любой кузов"
		/>
	</div>

	<div class="field">
		<label for="drive-select-trigger">Привод</label>
		<AppSelect
			id="drive-select-trigger"
			name="drive"
			items={driveItems}
			bind:value={driveValue}
			placeholder="Любой привод"
		/>
	</div>

	<div class="field">
		<label for="fuel-select-trigger">Топливо</label>
		<AppSelect
			id="fuel-select-trigger"
			name="fuel"
			items={fuelItems}
			bind:value={fuelValue}
			placeholder="Любое топливо"
		/>
	</div>

	<div class="field">
		<label for="seats-min-slider">Мест от: <strong>{seatsMinValue}</strong></label>
		{#key `${seatsSliderMin}-${seatsSliderMax}`}
			<Slider.Root
				id="seats-min-slider"
				type="single"
				min={seatsSliderMin}
				max={seatsSliderMax}
				step={1}
				bind:value={seatsMinValue}
				class="filter-slider"
			>
				{#snippet children({ thumbItems })}
					<Slider.Range class="filter-slider-range" />
					{#each thumbItems as item}
						<Slider.Thumb index={item.index} class="filter-slider-thumb" />
					{/each}
				{/snippet}
			</Slider.Root>
		{/key}
		{#if seatsMinValue > seatsFleetMin}
			<input type="hidden" name="seatsMin" value={String(seatsMinValue)} />
		{/if}
	</div>

	<div class="field">
		<label for="yearMin">Год от: <strong>{yearMinValue}</strong></label>
		<Slider.Root
			id="yearMin"
			type="single"
			min={yearMin}
			max={yearMax}
			step={1}
			bind:value={yearMinValue}
			class="filter-slider"
		>
			{#snippet children({ thumbItems })}
				<Slider.Range class="filter-slider-range" />
				{#each thumbItems as item}
					<Slider.Thumb index={item.index} class="filter-slider-thumb" />
				{/each}
			{/snippet}
		</Slider.Root>
		{#if yearMinValue > yearMin}
			<input type="hidden" name="yearMin" value={String(yearMinValue)} />
		{/if}
	</div>

	<div class="field">
		<label for="priceMax">Цена до: <strong>{priceMaxValue.toLocaleString('ru-RU')} ₽/сутки</strong></label>
		<Slider.Root
			id="priceMax"
			type="single"
			min={priceMin}
			max={priceMax}
			step={100}
			bind:value={priceMaxValue}
			class="filter-slider"
		>
			{#snippet children({ thumbItems })}
				<Slider.Range class="filter-slider-range" />
				{#each thumbItems as item}
					<Slider.Thumb index={item.index} class="filter-slider-thumb" />
				{/each}
			{/snippet}
		</Slider.Root>
		{#if priceMaxValue < priceMax}
			<input type="hidden" name="priceMax" value={String(priceMaxValue)} />
		{/if}
	</div>

	<button class="btn btn-primary full" type="submit">Показать варианты</button>
</form>

<style>
	.filters {
		padding: var(--space-3);
		display: grid;
		gap: var(--space-2);
		position: sticky;
		top: calc(var(--space-5) + var(--space-2));
		align-self: start;
		max-height: fit-content;
		overflow-y: auto;
	}

	.top-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
	}

	h2 {
		margin: 0;
		font-size: var(--text-3);
	}

	.clear {
		font-size: var(--text-5);
		color: var(--text-secondary);
		text-decoration: none;
	}

	:global(.filters .field) {
		gap: 0.35rem;
	}

	:global(.filter-slider) {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		height: 0.55rem;
		border-radius: 999px;
		border: var(--border-base);
		background: color-mix(in oklab, var(--bg-muted) 78%, #fff 22%);
		padding-inline: 0.1rem;
		overflow: visible;
	}

	:global(.filter-slider-range) {
		position: absolute;
		inset-block: 0.04rem;
		left: 0.4% !important;
		border-radius: 999px;
		background: linear-gradient(90deg, var(--accent) 0%, var(--accent-strong) 100%);
		pointer-events: none;
	}

	:global(.filter-slider-thumb) {
		width: 1rem;
		height: 1rem;
		border-radius: 999px;
		border: 2px solid var(--accent-strong);
		background: #fff;
		cursor: grab;
	}

	.full {
		width: 100%;
	}

	.full.btn-primary {
		min-height: 2.8rem;
	}

	@media (max-width: 980px) {
		.filters {
			position: static;
		}
	}
</style>
