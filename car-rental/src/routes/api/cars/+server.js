import { json } from '@sveltejs/kit';
import { getAvailableFilters, listCars } from '$lib/server/mock-data.js';

export function GET({ url }) {
	const classFilter = url.searchParams.get('class') ?? '';
	const transmissionFilter = url.searchParams.get('transmission') ?? '';
	const bodyFilter = url.searchParams.get('body') ?? '';
	const driveFilter = url.searchParams.get('drive') ?? '';
	const fuelFilter = url.searchParams.get('fuel') ?? '';
	const seatsFilter = url.searchParams.get('seatsMin') ?? '';
	const filters = {
		search: url.searchParams.get('search') ?? '',
		class: classFilter === 'all' ? '' : classFilter,
		transmission: transmissionFilter === 'all' ? '' : transmissionFilter,
		body: bodyFilter === 'all' ? '' : bodyFilter,
		drive: driveFilter === 'all' ? '' : driveFilter,
		fuel: fuelFilter === 'all' ? '' : fuelFilter,
		seatsMin: seatsFilter === 'all' ? '' : seatsFilter,
		yearMin: url.searchParams.get('yearMin') ?? '',
		priceMax: url.searchParams.get('priceMax') ?? ''
	};
	const items = listCars(filters);
	return json({
		items,
		total: items.length,
		filters: getAvailableFilters()
	});
}
