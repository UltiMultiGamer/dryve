<script>
	const placeholderImage = `data:image/svg+xml,${encodeURIComponent(
		`<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'><rect width='640' height='360' fill='#ecf1ea'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#5f7468' font-family='Segoe UI' font-size='20'>Dryve</text></svg>`
	)}`;

	let {
		src = '',
		alt = '',
		eager = false,
		height = '220px',
		/** @type {'cover' | 'contain'} */
		fit = 'cover',
		class: className = ''
	} = $props();

	let failed = $state(false);
	let loaded = $state(false);

	$effect(() => {
		void src;
		failed = false;
		loaded = false;
	});

	function onLoad() {
		loaded = true;
	}

	function onError() {
		failed = true;
		loaded = true;
	}
</script>

{#key src}
	<div
		class="car-image-frame {className}"
		style={`--car-img-h:${height};--car-img-fit:${fit}`}
	>
		{#if failed}
			<img class="photo visible" src={placeholderImage} alt="" />
		{:else if src}
			<img
				class="photo"
				class:visible={loaded}
				{src}
				{alt}
				loading={eager ? 'eager' : 'lazy'}
				decoding="async"
				fetchpriority={eager ? 'high' : 'auto'}
				onload={onLoad}
				onerror={onError}
			/>
		{:else}
			<img class="photo visible" src={placeholderImage} alt="" />
		{/if}

		{#if src && !failed && !loaded}
			<div class="spinner" aria-busy="true" aria-label="Загрузка изображения">
				<span class="spin"></span>
			</div>
		{/if}
	</div>
{/key}

<style>
	.car-image-frame {
		position: relative;
		width: 100%;
		height: var(--car-img-h, 220px);
		background: color-mix(in oklab, var(--bg-muted) 88%, #fff 12%);
		overflow: hidden;
	}

	.photo {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: var(--car-img-fit, cover);
		opacity: 0;
		transition: opacity var(--motion-base) var(--easing-standard);
	}

	.photo.visible {
		opacity: 1;
	}

	.spinner {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		pointer-events: none;
		background: color-mix(in oklab, var(--bg-muted) 45%, transparent);
	}

	.spin {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		border: 3px solid color-mix(in oklab, var(--line-color) 55%, transparent);
		border-top-color: var(--accent-strong);
		animation: spin-360 0.75s linear infinite;
	}

	@keyframes spin-360 {
		to {
			transform: rotate(360deg);
		}
	}
</style>
