<script>
	import CarImage from '$lib/components/CarImage.svelte';
	import { tierDiscountPercent } from '$lib/loyalty-pricing.js';

	let { data } = $props();

	const heroCars = [
		{ name: 'Toyota Camry', image: '/images/generic/toyota_camry_2_2.webp' },
		{ name: 'Porsche 911', image: '/images/sports/porsche_911_1_1.webp' },
		{ name: 'Rolls-Royce', image: '/images/luxury/rolls_royce_2_2.webp' }
	];

	const loyaltyTiers = [
		{
			id: 'go',
			title: 'Dryve Go',
			subtitle: 'Старт',
			icon: 'bi bi-leaf',
			discount: tierDiscountPercent('go'),
			accent: 'tier-go',
			lead: 'Для повседневных поездок',
			perks: [
				{ icon: 'bi bi-percent', text: 'Скидка 5% на аренду' },
				{ icon: 'bi bi-car-front', text: 'Доступ к основному парку' },
				{ icon: 'bi bi-headset', text: 'Базовая поддержка 24/7' }
			],
			highlight: 'Быстрый старт без условий'
		},
		{
			id: 'beyond',
			title: 'Dryve Beyond',
			subtitle: 'Для постоянных клиентов',
			icon: 'bi bi-stars',
			discount: tierDiscountPercent('beyond'),
			accent: 'tier-beyond',
			lead: 'Для тех, кто арендует чаще',
			perks: [
				{ icon: 'bi bi-percent', text: 'Скидка 8% на аренду' },
				{ icon: 'bi bi-key', text: 'Доступ к авто Beyond+' },
				{ icon: 'bi bi-lightning-charge', text: 'Приоритет на подтверждение' }
			],
			highlight: 'Оптимальный баланс цены и доступа'
		},
		{
			id: 'infinite',
			title: 'Dryve Infinite',
			subtitle: 'Максимум сервиса',
			icon: 'bi bi-gem',
			discount: tierDiscountPercent('infinite'),
			accent: 'tier-infinite',
			lead: 'Премиум-уровень и редкие модели',
			perks: [
				{ icon: 'bi bi-percent', text: 'Скидка 12% на аренду' },
				{ icon: 'bi bi-gem', text: 'Доступ к авто Infinite' },
				{ icon: 'bi bi-person-check', text: 'Персональный менеджер' }
			],
			highlight: 'Только для участников Infinite'
		}
	];
</script>

<section class="hero surface">
	<div class="hero-bg" aria-hidden="true">
		{#each heroCars as car, index}
			<div class="hero-slide" style={`--delay:${index * 5}s;--slide-image:url(${car.image})`}></div>
		{/each}
	</div>
	<div class="hero-overlay"></div>
	<div class="hero-content">
		<span class="eyebrow">Dryve</span>
		<h1>Аренда без лишней рутины</h1>
		<p>Подберите автомобиль под задачу: город, поездка выходного дня или деловая встреча.</p>
		<div class="actions">
			<a class="btn btn-primary" href="/cars">Открыть каталог</a>
			<a class="btn btn-secondary" href="/profile">Мои бронирования</a>
		</div>
	</div>
</section>

<section class="surface deals">
	<div class="section-head">
		<h2>Актуальные предложения</h2>
		<a href="/cars" class="btn btn-secondary">Смотреть все авто</a>
	</div>
	{#if data.dealCars?.length}
		<div class="deal-grid">
			{#each data.dealCars as car}
				<a class="surface deal-card" href={`/cars/${car.id}`}>
					<div class="deal-media">
						<CarImage src={car.image} alt={car.name} height="160px" eager={false} />
					</div>
					<div class="deal-body">
						<p class="deal-class">{car.class}</p>
						<h3>{car.name}</h3>
						<p class="deal-price">от {car.pricePerDay.toLocaleString('ru-RU')} ₽/сутки</p>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<p class="empty-deals">Загрузите каталог или попробуйте позже.</p>
	{/if}
</section>

<section class="loyalty">
	<div class="loyalty-intro surface">
		<h2>Программа лояльности Dryve</h2>
		<p>
			Уровень выбирается в профиле (демо): от него зависят скидка на суточную ставку и доступ к редким
			автомобилям. Скидка применяется автоматически при оформлении брони.
		</p>
	</div>
	<div class="tier-grid">
		{#each loyaltyTiers as tier}
			<article class="surface tier-card {tier.accent}">
				<div class="tier-top">
					
					<div class="tier-name">
						<h3>{tier.title}</h3>
					</div>
				</div>

				<div class="tier-discount-card">
					<p class="tier-discount">−{tier.discount}%</p>
					<span>на каждое бронирование</span>
				</div>

				<p class="tier-lead">{tier.lead}</p>
				<ul class="tier-perks">
					{#each tier.perks as perk}
						<li>
							<i class={perk.icon} aria-hidden="true"></i>
							{perk.text}
						</li>
					{/each}
				</ul>
				<div class="tier-foot">
					<span>
						<i class="bi bi-check2-circle" aria-hidden="true"></i>
						{tier.highlight}
					</span>
					<a class="btn tier-cta" href="/profile">Активировать</a>
				</div>
			</article>
		{/each}
	</div>
</section>

<style>
	.hero {
		position: relative;
		padding: var(--space-7) var(--space-5);
		margin-bottom: var(--space-6);
		overflow: hidden;
		min-height: 480px;
		border-radius: var(--radius-lg);
	}

	.hero-content {
		max-width: 58ch;
		position: relative;
		z-index: 2;
	}

	.hero p {
		max-width: 62ch;
		color: color-mix(in oklab, white 80%, var(--accent-soft) 20%);
	}

	.actions {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.hero-bg {
		position: absolute;
		inset: 0;
	}

	.hero-slide {
		position: absolute;
		inset: 0;
		opacity: 0;
		background-image: var(--slide-image);
		background-size: cover;
		background-position: center;
		background-color: color-mix(in oklab, var(--bg-muted) 70%, #203c2f 30%);
		animation: hero-cycle 15s linear infinite;
		animation-delay: var(--delay);
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(105deg, rgba(15, 41, 30, 0.84), rgba(16, 44, 34, 0.35));
		z-index: 1;
	}

	.hero h1,
	.hero .eyebrow {
		color: #fff;
	}

	.deals {
		padding: var(--space-5);
		margin-bottom: var(--space-5);
	}

	.section-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.deal-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: var(--space-4);
	}

	.deal-card {
		display: grid;
		grid-template-rows: auto 1fr;
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		border: var(--border-light);
		transition:
			border-color var(--motion-base) var(--easing-standard),
			outline-color var(--motion-base) var(--easing-standard);
	}

	.deal-card:hover {
		border-color: var(--accent);
		outline: 2px solid color-mix(in oklab, var(--accent) 25%, transparent);
		outline-offset: 1px;
	}

	.deal-media {
		border-bottom: var(--border-base);
	}

	.deal-body {
		padding: var(--space-3);
		display: grid;
		gap: 0.25rem;
	}

	.deal-class {
		margin: 0;
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-secondary);
	}

	.deal-card h3 {
		margin: 0;
		font-size: var(--text-3);
	}

	.deal-price {
		margin: 0;
		font-size: var(--text-5);
		color: var(--accent-strong);
		font-weight: 700;
	}

	.empty-deals {
		margin: 0;
		color: var(--text-secondary);
	}

	.loyalty {
		display: grid;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.loyalty-intro {
		padding: var(--space-5);
	}

	.loyalty-intro h2 {
		margin-bottom: var(--space-2);
	}

	.loyalty-intro p {
		margin: 0;
		max-width: 72ch;
		color: var(--text-secondary);
	}

	.tier-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--space-4);
	}

	.tier-card {
		padding: var(--space-6);
		display: grid;
		gap: var(--space-4);
		min-height: 100%;
		align-content: space-between;
		border: 1px solid color-mix(in oklab, var(--tier-color) 30%, var(--border-light));
		border-radius: var(--radius-lg);
		background: color-mix(in oklab, var(--tier-fill) 10%, var(--bg-surface));
		position: relative;
		overflow: hidden;
		transition:
			border-color var(--motion-base) var(--easing-standard),
			outline-color var(--motion-base) var(--easing-standard);
	}

	.tier-card:hover {
		border-color: color-mix(in oklab, var(--tier-color) 58%, var(--line-color));
		outline: 2px solid color-mix(in oklab, var(--tier-color) 25%, transparent);
		outline-offset: 1px;
	}

	.tier-top {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.tier-name {
		min-width: 0;
	}

	.tier-badge {
		margin: 0 0 0.2rem;
		font-size: 0.78rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: color-mix(in oklab, var(--tier-color) 64%, var(--text-secondary));
	}

	.tier-icon {
		width: 2.75rem;
		height: 2.75rem;
		flex: 0 0 2.75rem;
		display: inline-grid;
		place-items: center;
		border-radius: var(--radius-sm);
		border: 1px solid color-mix(in oklab, var(--tier-color) 40%, var(--line-color));
		color: color-mix(in oklab, var(--tier-color) 84%, var(--text-primary));
		background: color-mix(in oklab, var(--tier-fill) 18%, var(--bg-surface));
		font-size: 1.2rem;
	}

	.tier-card h3 {
		margin: 0;
		font-size: clamp(1.65rem, 3vw, 2.15rem);
		color: var(--text-primary);
	}

	.tier-discount-card {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--space-3);
		padding-block: var(--space-2);
		background: transparent;
	}

	.tier-discount-card span {
		max-width: 14ch;
		font-size: 0.95rem;
		font-weight: 700;
		line-height: 1.2;
		text-align: right;
		color: var(--text-secondary);
	}

	.tier-discount {
		margin: 0;
		font-size: clamp(3rem, 7vw, 4.4rem);
		font-weight: 800;
		line-height: 0.82;
		letter-spacing: -0.05em;
		color: color-mix(in oklab, var(--tier-color) 82%, var(--text-primary));
	}

	.tier-lead {
		margin: 0;
		font-size: var(--text-4);
		line-height: 1.45;
		color: var(--text-secondary);
	}

	.tier-perks {
		margin: var(--space-2) 0 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 0.7rem;
		font-size: var(--text-4);
		line-height: 1.4;
		color: var(--text-primary);
	}

	.tier-perks li {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.65rem 0;
		border-bottom: 1px solid color-mix(in oklab, var(--tier-color) 18%, transparent);
	}

	.tier-perks li i {
		color: color-mix(in oklab, var(--tier-color) 76%, var(--text-primary));
	}

	.tier-foot {
		margin-top: var(--space-3);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
		font-size: var(--text-5);
		color: var(--text-secondary);
	}

	.tier-foot span {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.tier-foot .tier-cta {
		color: #fff;
		font-weight: 700;
		text-decoration: none;
		border: 1px solid color-mix(in oklab, var(--tier-color) 76%, var(--text-primary));
		border-radius: 999px;
		padding: 0.5rem 0.95rem;
		background: color-mix(in oklab, var(--tier-color) 78%, var(--text-primary));
	}

	.tier-foot .tier-cta:hover,
	.tier-foot .tier-cta:focus-visible {
		text-decoration: none;
		border-color: color-mix(in oklab, var(--tier-color) 88%, var(--text-primary));
		background: color-mix(in oklab, var(--tier-color) 86%, var(--text-primary));
	}

	.tier-go {
		--tier-color: #2f9e68;
		--tier-fill: #2f9e68;
	}

	.tier-beyond {
		--tier-color: #2f9e68;
		--tier-fill: #cfd8cf;
	}

	.tier-infinite {
		--tier-color: #5cbf84;
		--tier-fill: #101714;
		border-color: color-mix(in oklab, var(--tier-color) 38%, #101714);
		background: #101714;
	}

	.tier-infinite h3,
	.tier-infinite .tier-lead,
	.tier-infinite .tier-foot,
	.tier-infinite .tier-badge,
	.tier-infinite .tier-perks,
	.tier-infinite .tier-discount-card span,
	.tier-infinite .tier-discount {
		color: color-mix(in oklab, #e7f4ec 90%, #b7d7c4 10%);
	}

	.tier-infinite .tier-discount-card {
		background: transparent;
	}

	.tier-infinite .tier-foot .tier-cta {
		color: #101714;
		background: var(--accent);
		border-color: var(--accent-strong);
	}

	@media (max-width: 680px) {
		.tier-foot {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	@keyframes hero-cycle {
		0%,
		24% {
			opacity: 0;
		}
		30%,
		54% {
			opacity: 1;
		}
		60%,
		100% {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-slide {
			animation: none;
			opacity: 1;
		}

	}
</style>
