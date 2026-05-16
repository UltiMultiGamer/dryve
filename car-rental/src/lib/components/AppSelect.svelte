<script>
	import { Select } from 'bits-ui';

	let {
		id,
		name = '',
		items = [],
		value = $bindable(''),
		placeholder = 'Выбрать',
		multiple = false,
		withApply = false,
		search = false
	} = $props();

	let query = $state('');
	let draftSingle = $state('');
	let draftMulti = $state([]);

	const normalizedItems = $derived(
		items.map((item) =>
			typeof item === 'string' ? { value: item, label: item } : item
		)
	);

	const filteredItems = $derived(
		search
			? normalizedItems.filter((item) =>
					item.label.toLowerCase().includes(query.toLowerCase().trim())
				)
			: normalizedItems
	);

	$effect(() => {
		if (multiple) {
			const incoming = Array.isArray(value) ? value : [];
			draftMulti = [...incoming];
		} else {
			const incoming = typeof value === 'string' ? value : '';
			draftSingle = incoming;
		}
	});

	$effect(() => {
		if (!withApply) {
			value = multiple ? [...draftMulti] : draftSingle;
		}
	});

	function applySelection() {
		value = multiple ? [...draftMulti] : draftSingle;
	}

	function clearSelection() {
		if (multiple) {
			draftMulti = [];
			value = [];
			return;
		}
		draftSingle = '';
		value = '';
	}
</script>

{#if multiple}
	<Select.Root
		type="multiple"
		items={filteredItems}
		name={withApply ? '' : name}
		bind:value={draftMulti}
	>
		<Select.Trigger id={id} class="input app-select-trigger">
			<Select.Value {placeholder} />
			<i class="bi bi-chevron-down" aria-hidden="true"></i>
		</Select.Trigger>

		<Select.Portal>
			<Select.Content class="app-select-content" sideOffset={8} sameWidth={true}>
			{#if search}
				<div class="select-search">
					<i class="bi bi-search" aria-hidden="true"></i>
					<input class="input search-input" type="search" bind:value={query} placeholder="Поиск..." />
				</div>
			{/if}

			<Select.Viewport>
				{#if filteredItems.length}
					{#each filteredItems as item}
						<Select.Item class="app-select-item" value={item.value} label={item.label}>
							{item.label}
						</Select.Item>
					{/each}
				{:else}
					<div class="select-empty">Ничего не найдено</div>
				{/if}
			</Select.Viewport>

			{#if withApply}
				<div class="select-actions">
					<button type="button" class="btn btn-secondary" onclick={clearSelection}>Сбросить</button>
					<button type="button" class="btn btn-primary" onclick={applySelection}>Применить</button>
				</div>
			{/if}
			</Select.Content>
		</Select.Portal>
	</Select.Root>
{:else}
	<Select.Root
		type="single"
		items={filteredItems}
		name={withApply ? '' : name}
		bind:value={draftSingle}
	>
		<Select.Trigger id={id} class="input app-select-trigger">
			<Select.Value {placeholder} />
			<i class="bi bi-chevron-down" aria-hidden="true"></i>
		</Select.Trigger>

		<Select.Portal>
			<Select.Content class="app-select-content" sideOffset={8} sameWidth={true}>
			{#if search}
				<div class="select-search">
					<i class="bi bi-search" aria-hidden="true"></i>
					<input class="input search-input" type="search" bind:value={query} placeholder="Поиск..." />
				</div>
			{/if}

			<Select.Viewport>
				{#if filteredItems.length}
					{#each filteredItems as item}
						<Select.Item class="app-select-item" value={item.value} label={item.label}>
							{item.label}
						</Select.Item>
					{/each}
				{:else}
					<div class="select-empty">Ничего не найдено</div>
				{/if}
			</Select.Viewport>

			{#if withApply}
				<div class="select-actions">
					<button type="button" class="btn btn-secondary" onclick={clearSelection}>Сбросить</button>
					<button type="button" class="btn btn-primary" onclick={applySelection}>Применить</button>
				</div>
			{/if}
			</Select.Content>
		</Select.Portal>
	</Select.Root>
{/if}

{#if withApply && name}
	{#if multiple}
		{#each value as selected}
			<input type="hidden" {name} value={selected} />
		{/each}
	{:else}
		<input type="hidden" {name} value={value} />
	{/if}
{/if}

<style>
	:global(.app-select-trigger) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	:global(.app-select-content) {
		width: min(100vw - 2rem, var(--bits-floating-anchor-width));
		min-width: min(100vw - 2rem, var(--bits-floating-anchor-width));
		border: var(--border-base);
		border-radius: var(--radius-sm);
		background: var(--bg-surface);
		padding: var(--space-1);
		max-height: 280px;
		overflow: auto;
		animation: dropdown-enter var(--motion-base) var(--easing-standard);
	}

	:global(.app-select-item) {
		padding: 0.55rem 0.7rem;
		border-radius: calc(var(--radius-sm) - 2px);
		cursor: pointer;
	}

	:global(.app-select-item[data-highlighted]),
	:global(.app-select-item[data-selected]) {
		background: var(--bg-muted);
	}

	.select-search {
		position: sticky;
		top: 0;
		z-index: 1;
		display: flex;
		align-items: center;
		margin-bottom: var(--space-1);
	}

	.select-search i {
		position: absolute;
		left: 0.6rem;
		color: var(--text-secondary);
	}

	.search-input {
		padding-left: 1.9rem;
	}

	.select-empty {
		padding: var(--space-2) var(--space-3);
		color: var(--text-secondary);
		font-size: var(--text-5);
	}

	.select-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-2);
		padding-top: var(--space-2);
		margin-top: var(--space-2);
		border-top: var(--border-base);
	}

	@keyframes dropdown-enter {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
