import { redirect } from '@sveltejs/kit';
import { getCarById, getUserBySession } from '$lib/server/mock-data.js';

export function load({ cookies, url }) {
	const user = getUserBySession(cookies.get('dryve_session'));
	if (!user) {
		const next = encodeURIComponent(url.pathname + url.search);
		throw redirect(302, `/login?next=${next}`);
	}

	const carId = url.searchParams.get('carId');
	const from = url.searchParams.get('from') ?? '';
	const to = url.searchParams.get('to') ?? '';
	const car = carId ? getCarById(carId) : null;

	return {
		user,
		from,
		to,
		car
	};
}
