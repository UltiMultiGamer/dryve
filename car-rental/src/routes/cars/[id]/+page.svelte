<script>
	import { cartItems } from '$lib/stores/cart.js';
	import { canAccessCar, memberTier } from '$lib/stores/memberTier.js';
	import { effectiveDailyRate, tierDiscountPercent } from '$lib/loyalty-pricing.js';
	import AppDateRangePicker from '$lib/components/AppDateRangePicker.svelte';
	import CarImage from '$lib/components/CarImage.svelte';

	let { data } = $props();

	const today = new Date();
	const nextDay = new Date(today);
	nextDay.setDate(today.getDate() + 1);

	function formatISO(date) {
		return date.toISOString().slice(0, 10);
	}

	function chunkBy(items, size = 4) {
		const rows = [];
		let index = 0;
		while (index < items.length) {
			rows.push(items.slice(index, index + size));
			index += size;
		}
		return rows;
	}

	function shortDriveLabel(drive) {
		if (drive === 'Передний привод') return 'Передний';
		if (drive === 'Полный привод') return 'Полный';
		if (drive === 'Задний привод') return 'Задний';
		return drive;
	}

	let from = $state(formatISO(today));
	let to = $state(formatISO(nextDay));
	const todayIso = formatISO(today);
	const bookingLink = $derived(`/book?carId=${data.car.id}&from=${from}&to=${to}`);
	const canRent = $derived(canAccessCar(data.car));
	const lockRank = $derived(Number(data.car.memberRankRequired) || 0);
	const thumbSources = $derived([data.car.image, ...(data.car.gallery ?? [])].filter(Boolean));

	const dailyDeal = $derived(effectiveDailyRate(data.car, $memberTier));
	const discountPct = $derived(tierDiscountPercent($memberTier));

	let mainImage = $state('');
	let tierMessage = $state('');
	let lightboxOpen = $state(false);
	let activeInfoTab = $state('specs');
	let thumbRowEl = $state(null);
	const colorOptions = [
		{ id: 'black', label: 'Черный', hex: '#1f2328' },
		{ id: 'white', label: 'Белый', hex: '#f3f5f2' },
		{ id: 'gray', label: 'Серый', hex: '#8d969f' },
		{ id: 'blue', label: 'Синий', hex: '#2f78b7' },
		{ id: 'red', label: 'Красный', hex: '#cc3a3a' }
	];
	let selectedColor = $state(colorOptions[0].id);

	$effect(() => {
		void data.car.id;
		mainImage = data.car.image;
		tierMessage = '';
	});

	const galleryLen = $derived(thumbSources.length);
	const galleryIndex = $derived(Math.max(0, thumbSources.indexOf(mainImage)));
	const infoTabs = [
		{ id: 'specs', label: 'Спецификация' },
		{ id: 'reviews', label: 'Отзывы' },
		{ id: 'insurance', label: 'Страховка' },
		{ id: 'legal', label: 'Условия' }
	];

	function galleryPrev() {
		if (galleryLen < 2) return;
		const i = thumbSources.indexOf(mainImage);
		const next = i <= 0 ? galleryLen - 1 : i - 1;
		mainImage = thumbSources[next];
	}

	function galleryNext() {
		if (galleryLen < 2) return;
		const i = thumbSources.indexOf(mainImage);
		const next = i < 0 ? 0 : (i + 1) % galleryLen;
		mainImage = thumbSources[next];
	}

	function openLightbox() {
		lightboxOpen = true;
	}

	function closeLightbox() {
		lightboxOpen = false;
	}

	$effect(() => {
		if (!lightboxOpen) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		function onKey(e) {
			if (e.key === 'Escape') {
				e.preventDefault();
				closeLightbox();
			}
			if (e.key === 'ArrowLeft') galleryPrev();
			if (e.key === 'ArrowRight') galleryNext();
		}
		window.addEventListener('keydown', onKey);
		return () => {
			document.body.style.overflow = prev;
			window.removeEventListener('keydown', onKey);
		};
	});

	$effect(() => {
		if (!thumbRowEl || galleryLen <= 3) return;
		const activeIndex = thumbSources.indexOf(mainImage);
		if (activeIndex < 0) return;
		const activeThumb = thumbRowEl.querySelector(`[data-thumb-index="${activeIndex}"]`);
		if (!activeThumb) return;
		activeThumb.scrollIntoView({
			behavior: 'smooth',
			block: 'nearest',
			inline: 'nearest'
		});
	});

	const specGroups = $derived([
		{
			title: 'Базовые параметры',
			rows: chunkBy([
				{ label: 'Год', value: String(data.car.year), icon: 'bi-calendar4-week' },
				{ label: 'Пробег', value: `${data.car.mileageKm.toLocaleString('ru-RU')} км`, icon: 'bi-speedometer2' },
				{ label: 'Кузов', value: data.car.body, icon: 'bi-car-front' },
				{ label: 'Мест', value: String(data.car.seats), icon: 'bi-people' }
			])
		},
		{
			title: 'Технические Параметры',
			rows: chunkBy([
				{ label: 'Привод', value: shortDriveLabel(data.car.drive), icon: 'bi-arrow-left-right' },
				{ label: 'Коробка', value: data.car.transmission, icon: 'bi-gear' },
				{ label: 'Топливо', value: data.car.fuel, icon: 'bi-fuel-pump' },
				{ label: 'Двигатель', value: data.car.engine, icon: 'bi-cpu' }
			])
		}
	]);

	let added = $state(false);

	function addToCart() {
		tierMessage = '';
		if (!canAccessCar(data.car)) {
			tierMessage =
				lockRank >= 2
					? 'Этот автомобиль доступен с уровня Dryve Infinite. Измените уровень в профиле (демо).'
					: 'Этот автомобиль доступен с уровня Dryve Beyond. Измените уровень в профиле (демо).';
			return;
		}
		const result = cartItems.add(data.car);
		if (result && result.ok === false && result.reason === 'tier') {
			tierMessage = 'Недостаточный уровень лояльности для добавления в корзину.';
			return;
		}
		added = true;
		setTimeout(() => {
			added = false;
		}, 1200);
	}
</script>

<article class="surface detail-layout">
	<div class="media-col">
		<div class="hero-stage">
			<div class="hero-media">
				<CarImage
					src={mainImage}
					alt={data.car.name}
					height="100%"
					fit="contain"
					eager={true}
					class="detail-hero"
				/>
			</div>
			<div class="hero-chrome">
				{#if galleryLen > 1}
					<button
						type="button"
						class="hero-nav hero-nav--prev"
						onclick={galleryPrev}
						aria-label="Предыдущее фото"
					>
						<i class="bi bi-chevron-left"></i>
					</button>
					<button
						type="button"
						class="hero-nav hero-nav--next"
						onclick={galleryNext}
						aria-label="Следующее фото"
					>
						<i class="bi bi-chevron-right"></i>
					</button>
				{/if}
				<button
					type="button"
					class="hero-zoom"
					onclick={openLightbox}
					aria-label="Увеличить фото"
				>
					<i class="bi bi-zoom-in"></i>
				</button>
				{#if galleryLen > 1}
					<span class="hero-counter">{galleryIndex + 1} / {galleryLen}</span>
				{/if}
			</div>
		</div>
		{#if thumbSources.length > 1}
			<div class="thumb-row" role="list" bind:this={thumbRowEl}>
				{#each thumbSources as src, i (src + i)}
					<button
						type="button"
						class="thumb"
						class:active={src === mainImage}
						onclick={() => (mainImage = src)}
						aria-label={`Фото ${i + 1}`}
						data-thumb-index={i}
					>
						<img {src} alt="" loading="lazy" decoding="async" class="thumb-img" />
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<div class="info-col">
		<p class="detail-meta">
			<span class="detail-eyebrow">{data.car.class}</span>
			{#if data.car.tags?.length}
				<span class="detail-meta-sep" aria-hidden="true">·</span>
				<span class="detail-tag-line">{(data.car.tags ?? []).join(' · ')}</span>
			{/if}
		</p>
		<h1 class="detail-title">{data.car.name}</h1>

		<div class="hero-price" aria-live="polite">
			<div class="hero-price-line">
				<span class="hero-price-main">{dailyDeal.toLocaleString('ru-RU')} ₽</span>
				<span class="hero-price-unit">/ сутки</span>
			</div>
			{#if dailyDeal < data.car.pricePerDay}
				<p class="hero-price-meta">
					<span class="strike">{data.car.pricePerDay.toLocaleString('ru-RU')} ₽ без скидки</span>
					<span class="save-pill">−{discountPct}% по вашему уровню</span>
				</p>
			{/if}
		</div>

		<p class="description">{data.car.description}</p>

		<div class="booking-box">
			<div class="booking-highlights" aria-label="Преимущества аренды">
				<p><i class="bi bi-shield-check"></i>Базовая страховка включена</p>
				<p><i class="bi bi-clock-history"></i>Быстрое подтверждение брони</p>
				<p><i class="bi bi-headset"></i>Поддержка 24/7</p>
			</div>
			<div class="field color-picker" aria-label="Выбор цвета автомобиля">
				<p class="color-label">Цвет автомобиля (предпочтение)</p>
				<div class="color-swatches" role="radiogroup" aria-label="Цвет автомобиля">
					{#each colorOptions as option}
						<button
							type="button"
							role="radio"
							class="color-swatch"
							class:active={selectedColor === option.id}
							aria-checked={selectedColor === option.id}
							aria-label={option.label}
							title={option.label}
							style={`--swatch:${option.hex}`}
							onclick={() => (selectedColor = option.id)}
						>
							{#if selectedColor === option.id}
								<i class="bi bi-check2"></i>
							{/if}
						</button>
					{/each}
				</div>
			</div>
			<div class="period-bottom">
				<AppDateRangePicker
					id="booking-range"
					label="Период аренды"
					min={todayIso}
					bind:start={from}
					bind:end={to}
				/>
			</div>
			<div class="booking-actions">
				{#if canRent}
					<a class="btn btn-primary" href={bookingLink}>Арендовать сейчас</a>
				{:else}
					<span class="btn btn-secondary disabled-rent btn-state-error" aria-disabled="true">
						<i class="bi bi-x-lg"></i>
						{lockRank >= 2 ? 'Требуется Dryve Infinite' : 'Требуется Dryve Beyond'}
					</span>
				{/if}
				<button
					class="btn btn-primary cart-action"
					class:btn-state-success={added}
					class:btn-state-error={!!tierMessage}
					type="button"
					onclick={addToCart}
					title={tierMessage || 'Добавить автомобиль в корзину'}
				>
					{#if added}
						<i class="bi bi-check2"></i>
						Добавлено
					{:else if tierMessage}
						<i class="bi bi-x-lg"></i>
						Недоступно
					{:else}
						<i class="bi bi-bag-plus"></i>
						Добавить в корзину
					{/if}
				</button>
			</div>
		</div>
	</div>
</article>

<section class="surface detail-extra" aria-label="Дополнительная информация по аренде">
	<div class="detail-tabs" role="tablist" aria-label="Разделы информации">
		{#each infoTabs as tab}
			<button
				type="button"
				role="tab"
				class="tab-item"
				class:active={activeInfoTab === tab.id}
				aria-selected={activeInfoTab === tab.id}
				onclick={() => (activeInfoTab = tab.id)}
			>
				{tab.label}
			</button>
		{/each}
	</div>
	<div class="tab-panel">
		{#if activeInfoTab === 'specs'}
			<div class="stats-board" aria-label="Характеристики автомобиля">
				{#each specGroups as group}
					<section class="spec-group">
						<h2>{group.title}</h2>
						{#each group.rows as row}
							<div class="stats-row" style={`--cols:${row.length};`}>
								{#each row as item}
									<article class="stat-cell">
										<p class="stat-label">
											<i class={`bi ${item.icon}`}></i>
											<span>{item.label}</span>
										</p>
										<strong>{item.value}</strong>
									</article>
								{/each}
							</div>
						{/each}
					</section>
				{/each}
			</div>
		{:else}
			<div class="extra-card">
				<p>Заглушка</p>
			</div>
		{/if}
	</div>
</section>

{#if lightboxOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="lightbox-backdrop" role="presentation" onclick={closeLightbox}>
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<div
			class="lightbox-panel"
			role="dialog"
			aria-modal="true"
			aria-label="Просмотр фото"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
		>
			<button type="button" class="lightbox-close" onclick={closeLightbox} aria-label="Закрыть">
				<i class="bi bi-x-lg"></i>
			</button>
			{#if galleryLen > 1}
				<button type="button" class="lightbox-nav lightbox-nav--prev" onclick={galleryPrev} aria-label="Предыдущее">
					<i class="bi bi-chevron-left"></i>
				</button>
				<button type="button" class="lightbox-nav lightbox-nav--next" onclick={galleryNext} aria-label="Следующее">
					<i class="bi bi-chevron-right"></i>
				</button>
			{/if}
			<img class="lightbox-img" src={mainImage} alt={data.car.name} />
			{#if galleryLen > 1}
				<p class="lightbox-caption">{galleryIndex + 1} из {galleryLen}</p>
			{/if}
		</div>
	</div>
{/if}

<style>
	.detail-layout {
		display: grid;
		grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
		gap: clamp(var(--space-4), 2.7vw, var(--space-6));
		padding: clamp(var(--space-2), 1.8vw, var(--space-3)) clamp(var(--space-2), 2.2vw, var(--space-5));
		max-width: min(1420px, 96vw);
		margin-inline: auto;
	}

	@media (min-width: 1081px) {
		.detail-layout {
			align-items: stretch;
		}

		.media-col {
			align-self: start;
		}

		.info-col {
			height: 100%;
		}
	}

	.media-col {
		min-width: 0;
		display: grid;
		gap: var(--space-2);
		align-content: start;
	}

	.hero-stage {
		position: relative;
		border-radius: var(--radius-md);
	}

	.hero-media {
		border-radius: var(--radius-md);
		border: var(--border-base);
		overflow: hidden;
		aspect-ratio: 16 / 9;
		width: 100%;
		min-height: clamp(240px, 32vw, 380px);
		background: color-mix(in oklab, var(--bg-muted) 88%, #fff 12%);
	}

	.hero-chrome {
		position: absolute;
		inset: 0;
		pointer-events: none;
		border-radius: inherit;
	}

	.hero-nav,
	.hero-zoom {
		pointer-events: auto;
		position: absolute;
		display: grid;
		place-items: center;
		border: var(--border-base);
		background: color-mix(in oklab, var(--bg-surface) 88%, var(--bg-muted) 12%);
		color: var(--text-primary);
		cursor: pointer;
		transition:
			background var(--motion-base) var(--easing-standard),
			border-color var(--motion-base) var(--easing-standard),
			outline-color var(--motion-base) var(--easing-standard);
	}

	.hero-nav:hover,
	.hero-zoom:hover {
		background: var(--bg-surface);
		border-color: var(--hover-outline);
		outline: 2px solid color-mix(in oklab, var(--text-primary) 18%, transparent);
		outline-offset: 1px;
	}

	.hero-nav {
		top: 50%;
		translate: 0 -50%;
		width: 2.35rem;
		height: 2.35rem;
		border-radius: 999px;
		font-size: 1.15rem;
	}

	.hero-nav--prev {
		left: 0.55rem;
	}

	.hero-nav--next {
		right: 0.55rem;
	}

	.hero-zoom {
		top: 0.55rem;
		right: 0.55rem;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: var(--radius-sm);
		font-size: 1.1rem;
	}

	.hero-counter {
		position: absolute;
		bottom: 0.55rem;
		left: 50%;
		translate: -50% 0;
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--text-primary);
		background: color-mix(in oklab, var(--bg-surface) 92%, var(--bg-muted) 8%);
		border: var(--border-base);
		pointer-events: none;
	}

	:global(.detail-hero.car-image-frame) {
		min-height: 0;
		height: 100%;
	}

	.thumb-row {
		display: flex;
		flex-wrap: nowrap;
		gap: 0.45rem;
		width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		padding: 0 0.1rem 0.15rem 0;
		scroll-behavior: smooth;
		scrollbar-width: thin;
	}

	.thumb {
		flex: 0 0 calc((100% - 0.9rem) / 3);
		padding: 0;
		border: var(--border-base);
		border-radius: var(--radius-sm);
		overflow: hidden;
		min-width: 0;
		width: calc((100% - 0.9rem) / 3);
		cursor: pointer;
		background: var(--bg-muted);
		line-height: 0;
	}

	.thumb.active {
		border-color: var(--accent-strong);
		background: color-mix(in oklab, var(--accent-soft) 18%, var(--bg-muted) 82%);
	}

	.thumb-img {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 10;
		height: auto;
		object-fit: cover;
	}

	.hero-price {
		display: grid;
		gap: 0.15rem;
		margin: 0 0 1rem;
	}

	.hero-price-line {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.35rem;
	}

	.hero-price-main {
		font-size: clamp(1.75rem, 4vw, 2.35rem);
		font-weight: 800;
		color: var(--accent-strong);
		letter-spacing: -0.02em;
		line-height: 1;
	}

	.hero-price-unit {
		font-size: var(--text-4);
		font-weight: 600;
		color: color-mix(in oklab, var(--accent-strong) 55%, var(--text-secondary) 45%);
	}

	.hero-price-meta {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		font-size: var(--text-5);
	}

	.strike {
		text-decoration: line-through;
		color: var(--text-secondary);
	}

	.save-pill {
		font-weight: 700;
		color: var(--danger);
	}

	.disabled-rent {
		pointer-events: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
	}

	.info-col {
		display: flex;
		flex-direction: column;
		gap: 0;
		align-items: stretch;
		min-width: 0;
		padding-left: clamp(0.2rem, 1vw, 0.7rem);
	}

	.detail-meta {
		margin: 0 0 0.35rem;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.35rem;
		line-height: 1.35;
	}

	.detail-eyebrow {
		display: inline;
		margin: 0;
		font-size: var(--text-5);
		font-weight: 400;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.detail-tag-line {
		display: inline;
		margin: 0;
		font-size: var(--text-5);
		font-weight: 400;
		text-transform: none;
		letter-spacing: normal;
		color: var(--text-secondary);
	}

	.detail-meta-sep {
		opacity: 0.45;
		user-select: none;
		font-size: var(--text-5);
		color: var(--text-secondary);
	}

	.detail-title {
		margin: 0 0 0.75rem;
		font-size: clamp(1.4rem, 2.7vw, 1.95rem);
		line-height: 1.12;
		font-family: var(--font-heading);
		font-weight: 600;
	}

	.description {
		margin: 0 0 1rem;
		max-width: none;
		width: 100%;
		font-size: var(--text-4);
		line-height: 1.55;
		text-wrap: pretty;
		color: color-mix(in oklab, var(--text-primary) 88%, var(--text-secondary) 12%);
	}

	.stats-board {
		padding: 0;
		display: grid;
		gap: var(--space-2);
	}

	.spec-group {
		display: grid;
		gap: 0.35rem;
	}

	.spec-group h2 {
		margin: 0;
		font-size: 0.72rem;
		font-family: var(--font-body);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-secondary);
	}

	.stats-row {
		display: grid;
		grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
		gap: 0.4rem;
	}

	.stat-cell {
		border: var(--border-base);
		border-radius: var(--radius-sm);
		padding: 0.38rem 0.45rem;
		display: grid;
		gap: 0.12rem;
		min-height: 0;
		background: color-mix(in oklab, #fff 86%, var(--bg-muted) 14%);
	}

	.stat-label {
		margin: 0;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: color-mix(in oklab, var(--text-secondary) 72%, #8a8a8a 28%);
		font-size: 0.68rem;
		text-align: left;
	}

	.stat-label i {
		font-size: 0.78rem;
	}

	.stat-cell strong {
		font-weight: 600;
		font-size: 0.8rem;
		line-height: 1.25;
		text-align: left;
	}

	.booking-box {
		padding: 0;
		display: grid;
		gap: var(--space-2);
		margin-top: 0.35rem;
	}

	.booking-highlights {
		display: grid;
		gap: var(--space-1);
		margin: 0 0 var(--space-1);
	}

	.booking-highlights p {
		margin: 0;
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-5);
		color: var(--text-secondary);
	}

	.booking-highlights i {
		color: var(--accent-strong);
	}

	.color-picker {
		display: grid;
		gap: var(--space-1);
		margin: 0 0 var(--space-1);
	}

	.color-label {
		margin: 0;
		font-size: var(--text-5);
		color: var(--text-secondary);
	}

	.color-swatches {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.color-swatch {
		width: 2rem;
		height: 2rem;
		display: grid;
		place-items: center;
		padding: 0;
		border-radius: var(--radius-sm);
		border: var(--border-base);
		background: var(--swatch, var(--bg-muted));
		cursor: pointer;
		color: #fff;
	}

	.color-swatch.active {
		border-color: var(--accent-strong);
		background:
			linear-gradient(0deg, color-mix(in oklab, var(--accent-soft) 24%, transparent), color-mix(in oklab, var(--accent-soft) 24%, transparent)),
			var(--swatch, var(--bg-muted));
	}

	.color-swatch i {
		font-size: 1rem;
		line-height: 1;
	}

	.color-swatch.active i {
		color: #1aa357;
	}

	.booking-actions {
		display: grid;
		gap: var(--space-2);
	}

	.cart-action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
	}

	.btn-state-success {
		background: color-mix(in oklab, var(--accent-strong) 88%, #fff 12%);
		border-color: color-mix(in oklab, var(--accent-strong) 75%, #000 25%);
	}

	.btn-state-error {
		background: color-mix(in oklab, var(--danger) 86%, #fff 14%);
		border-color: color-mix(in oklab, var(--danger) 68%, #000 32%);
		color: #fff;
	}

	.period-bottom {
		margin-top: var(--space-2);
	}

	.booking-box {
		margin-top: auto;
	}

	.lightbox-backdrop {
		position: fixed;
		inset: 0;
		z-index: 200;
		display: grid;
		place-items: center;
		padding: var(--space-4);
		background: color-mix(in oklab, var(--text-primary) 70%, transparent);
		backdrop-filter: blur(4px);
	}

	.lightbox-panel {
		position: relative;
		width: min(1080px, 100%);
		max-height: min(88dvh, 900px);
		display: grid;
		place-items: center;
		padding: var(--space-2);
	}

	.lightbox-img {
		max-width: 100%;
		max-height: min(82dvh, 820px);
		width: auto;
		height: auto;
		object-fit: contain;
		border-radius: var(--radius-md);
	}

	.lightbox-close {
		position: absolute;
		top: 0.35rem;
		right: 0.35rem;
		z-index: 2;
		width: 2.5rem;
		height: 2.5rem;
		display: grid;
		place-items: center;
		border: var(--border-base);
		border-radius: var(--radius-sm);
		background: color-mix(in oklab, var(--bg-surface) 94%, var(--bg-muted) 6%);
		color: var(--text-primary);
		cursor: pointer;
	}

	.lightbox-close:hover {
		background: var(--bg-surface);
		border-color: var(--hover-outline);
		outline: 2px solid color-mix(in oklab, var(--text-primary) 18%, transparent);
		outline-offset: 1px;
	}

	.lightbox-nav {
		position: absolute;
		top: 50%;
		translate: 0 -50%;
		z-index: 2;
		width: 2.75rem;
		height: 2.75rem;
		display: grid;
		place-items: center;
		border-radius: 999px;
		border: var(--border-base);
		background: color-mix(in oklab, var(--bg-surface) 92%, var(--bg-muted) 8%);
		color: var(--text-primary);
		font-size: 1.25rem;
		cursor: pointer;
	}

	.lightbox-nav:hover {
		background: var(--bg-surface);
		border-color: var(--hover-outline);
		outline: 2px solid color-mix(in oklab, var(--text-primary) 18%, transparent);
		outline-offset: 1px;
	}

	.lightbox-nav--prev {
		left: 0.25rem;
	}

	.lightbox-nav--next {
		right: 0.25rem;
	}

	.lightbox-caption {
		position: absolute;
		bottom: 0.25rem;
		left: 50%;
		translate: -50% 0;
		margin: 0;
		padding: 0.25rem 0.65rem;
		font-size: var(--text-5);
		font-weight: 600;
		color: var(--text-primary);
		background: color-mix(in oklab, var(--bg-surface) 94%, transparent);
		border-radius: 999px;
		border: var(--border-base);
	}

	.detail-extra {
		margin: var(--space-4) auto 0;
		padding: var(--space-3) var(--space-4) var(--space-4);
		max-width: min(1420px, 96vw);
	}

	.detail-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
		border-bottom: var(--border-base);
		margin-bottom: var(--space-3);
	}

	.tab-item {
		padding: 0 0 var(--space-2);
		border: 0;
		border-bottom: 2px solid transparent;
		background: transparent;
		color: var(--text-secondary);
		font-size: var(--text-4);
		font-family: var(--font-body);
		font-weight: 600;
		cursor: pointer;
	}

	.tab-item.active {
		color: var(--text-primary);
		border-bottom-color: var(--accent-strong);
	}

	.tab-panel {
		padding-top: var(--space-1);
	}

	.extra-card p {
		margin: 0;
		color: var(--text-secondary);
		font-size: var(--text-4);
	}

	@media (max-width: 640px) {
		.hero-nav {
			width: 2rem;
			height: 2rem;
			font-size: 1rem;
		}

		.hero-nav--prev {
			left: 0.35rem;
		}

		.hero-nav--next {
			right: 0.35rem;
		}

		.lightbox-nav {
			width: 2.35rem;
			height: 2.35rem;
		}

		.stats-row {
			grid-template-columns: 1fr;
		}

		.booking-actions {
			grid-template-columns: 1fr;
		}

	}

	@media (min-width: 760px) {
		.booking-actions {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 1080px) {
		.detail-layout {
			grid-template-columns: 1fr;
		}

		.info-col {
			padding-left: 0;
		}

		.stats-row {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

	}
</style>
