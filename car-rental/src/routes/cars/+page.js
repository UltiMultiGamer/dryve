export async function load({ fetch, url }) {
	const params = new URLSearchParams();
	['search', 'class', 'transmission', 'body', 'drive', 'fuel', 'seatsMin', 'yearMin', 'priceMax'].forEach((key) => {
		const value = url.searchParams.get(key);
		if (value && value !== 'all') params.set(key, value);
	});

	const response = await fetch(`/api/cars?${params.toString()}`);
	const payload = await response.json();

	return {
		items: payload.items ?? [],
		total: payload.total ?? 0,
		filters: payload.filters ?? {
			classes: [],
			transmissions: [],
			bodies: [],
			drives: [],
			fuels: [],
			seats: [],
			seatsFleetMin: 2,
			seatsFleetMax: 9,
			seatsSlider: { min: 2, max: 9 },
			years: [],
			priceRange: { min: 0, max: 0 }
		},
		active: {
			search: url.searchParams.get('search') ?? '',
			class: url.searchParams.get('class') || 'all',
			transmission: url.searchParams.get('transmission') || 'all',
			body: url.searchParams.get('body') || 'all',
			drive: url.searchParams.get('drive') || 'all',
			fuel: url.searchParams.get('fuel') || 'all',
			seatsMin: url.searchParams.get('seatsMin') || '',
			yearMin: url.searchParams.get('yearMin') || '',
			priceMax: url.searchParams.get('priceMax') ?? ''
		}
	};
}
