<script>
	import { DatePicker } from 'bits-ui';
	import { parseDate } from '@internationalized/date';

	let {
		id,
		name = '',
		label = '',
		value = $bindable(''),
		placeholder = 'Выберите дату',
		min = '',
		max = '',
		required = false
	} = $props();

	let dateValue = $state();

	function toDateValue(isoDate) {
		if (!isoDate) return undefined;
		try {
			return parseDate(isoDate);
		} catch {
			return undefined;
		}
	}

	const minValue = $derived(toDateValue(min));
	const maxValue = $derived(toDateValue(max));

	$effect(() => {
		const nextValue = toDateValue(value);
		const currentValue = dateValue?.toString?.() ?? '';
		const normalizedNext = nextValue?.toString?.() ?? '';
		if (currentValue !== normalizedNext) {
			dateValue = nextValue;
		}
	});

	$effect(() => {
		const next = dateValue?.toString?.() ?? '';
		if (value !== next) {
			value = next;
		}
	});
</script>

<div class="field date-field">
	{#if label}
		<label for={id}>{label}</label>
	{/if}

	<DatePicker.Root
		{required}
		{minValue}
		{maxValue}
		weekStartsOn={1}
		fixedWeeks={true}
		locale="ru-RU"
		calendarLabel={label || placeholder}
		bind:value={dateValue}
		name={name}
	>
		<DatePicker.Trigger class="input date-trigger" {id}>
			<DatePicker.Input class="date-input" {placeholder}>
				{#snippet children({ segments })}
					{#each segments as segment}
						<DatePicker.Segment class="date-segment" part={segment.part}>
							{segment.value}
						</DatePicker.Segment>
					{/each}
				{/snippet}
			</DatePicker.Input>
			<i class="bi bi-calendar3" aria-hidden="true"></i>
		</DatePicker.Trigger>

		<DatePicker.Portal>
			<DatePicker.Content class="surface date-content" sideOffset={8} align="start">
				<DatePicker.Calendar class="calendar-root" />
			</DatePicker.Content>
		</DatePicker.Portal>
	</DatePicker.Root>
</div>

<style>
	.date-field {
		gap: 0.35rem;
	}

	:global(.date-trigger) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
		cursor: pointer;
	}

	:global(.date-input) {
		display: inline-flex;
		align-items: center;
		gap: 0.1rem;
		font-size: var(--text-4);
	}

	:global(.date-segment) {
		min-width: 0.45ch;
	}

	:global(.date-trigger i) {
		color: var(--text-secondary);
	}

	:global(.date-content) {
		padding: var(--space-3);
		border-radius: var(--radius-md);
		min-width: 304px;
	}

	:global(.calendar-root [data-calendar-header]) {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
	}

	:global(.calendar-root [data-calendar-heading]) {
		margin: 0;
		font-size: var(--text-5);
		text-align: center;
		font-family: var(--font-body);
		font-weight: 700;
	}

	:global(.calendar-root [data-calendar-prev-button]),
	:global(.calendar-root [data-calendar-next-button]) {
		width: 1.9rem;
		height: 1.9rem;
		display: inline-grid;
		place-items: center;
		border: var(--border-base);
		border-radius: var(--radius-sm);
		background: #fff;
		cursor: pointer;
	}

	:global(.calendar-root [data-calendar-grid]) {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0.15rem;
	}

	:global(.calendar-root [data-calendar-head-cell]) {
		padding-bottom: 0.35rem;
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--text-secondary);
		text-transform: uppercase;
	}

	:global(.calendar-root [data-calendar-day]) {
		width: 2rem;
		height: 2rem;
		display: inline-grid;
		place-items: center;
		border-radius: 999px;
		font-size: var(--text-5);
	}

	:global(.calendar-root [data-calendar-day][data-today]) {
		border: 1px solid var(--accent-strong);
	}

	:global(.calendar-root [data-calendar-day][data-selected]) {
		background: var(--accent-strong);
		color: #fff;
	}

	:global(.calendar-root [data-calendar-day][data-disabled]) {
		opacity: 0.4;
	}

	:global(.calendar-root [data-calendar-day][data-outside-month]) {
		opacity: 0.5;
	}
</style>
