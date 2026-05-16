<script>
	/** @type {string} */
	let { href = '/', large = false } = $props();
</script>

<a {href} class="app-brand" class:large>
	<span class="brand-word">Dry</span><span class="brand-accent">ve</span>
</a>

<style>
	.app-brand {
		display: inline-flex;
		align-items: baseline;
		gap: 0;
		font-family: var(--font-heading);
		font-size: 1.35rem;
		font-weight: 700;
		line-height: 1;
		text-decoration: none;
		white-space: nowrap;
		letter-spacing: -0.02em;
	}

	.app-brand.large {
		font-size: 1.65rem;
	}

	.brand-word {
		color: var(--text-primary);
	}

	.brand-accent {
		color: var(--accent-strong);
	}
</style>
