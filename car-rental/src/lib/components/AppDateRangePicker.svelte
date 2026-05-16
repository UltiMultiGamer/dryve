<script>
	let {
		id,
		label = '',
		start = $bindable(''),
		end = $bindable(''),
		startName = '',
		endName = '',
		min = '',
		max = '',
		required = false
	} = $props();

	function onStartChange(event) {
		const value = event.currentTarget.value;
		start = value;
		if (end && value && end < value) {
			end = value;
		}
	}

	function onEndChange(event) {
		const value = event.currentTarget.value;
		end = value;
	}

	const periodDays = $derived.by(() => {
		if (!start || !end) return 0;
		const from = new Date(start);
		const to = new Date(end);
		const diff = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
		return Number.isFinite(diff) && diff > 0 ? diff : 0;
	});
</script>

<div class="field date-range-field">
	{#if label}
		<label for={id}>{label}</label>
	{/if}

	<div class="input date-range-trigger">
		<div class="segment-col">
			<span class="segment-label">С</span>
			<input
				class="date-input"
				type="date"
				id={id}
				name={startName}
				value={start}
				min={min || undefined}
				max={max || undefined}
				{required}
				onchange={onStartChange}
			/>
		</div>
		<span class="divider" aria-hidden="true"></span>
		<div class="segment-col">
			<span class="segment-label">По</span>
			<input
				class="date-input"
				type="date"
				name={endName}
				value={end}
				min={start || min || undefined}
				max={max || undefined}
				{required}
				onchange={onEndChange}
			/>
		</div>
		{#if periodDays > 0}
			<span class="duration-badge">{periodDays} дн.</span>
		{/if}
	</div>
</div>

<style>
	.date-range-field {
		gap: 0.35rem;
	}

	.date-range-trigger {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--space-2);
	}

	.segment-col {
		min-width: 0;
		display: grid;
		gap: 0.1rem;
	}

	.segment-label {
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-secondary);
	}

	.divider {
		width: 1px;
		height: 1.75rem;
		background: color-mix(in oklab, var(--line-color) 65%, transparent 35%);
	}

	.date-input {
		border: 0;
		background: transparent;
		color: var(--text-primary);
		font-size: var(--text-3);
		font-family: var(--font-body);
		line-height: 1.2;
		min-height: 1.2rem;
		padding: 0;
		min-width: 0;
	}

	.date-input:focus-visible {
		outline: none;
	}

	.duration-badge {
		border: var(--border-base);
		border-radius: var(--radius-sm);
		padding: 0.18rem 0.45rem;
		font-size: var(--text-5);
		font-weight: 600;
		color: var(--text-secondary);
		background: color-mix(in oklab, var(--bg-muted) 65%, var(--bg-surface) 35%);
	}

	@media (max-width: 760px) {
		.date-range-trigger {
			grid-template-columns: 1fr;
		}

		.divider {
			display: none;
		}
	}
</style>
