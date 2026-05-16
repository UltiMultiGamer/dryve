import { json } from '@sveltejs/kit';
import { getCarById } from '$lib/server/mock-data.js';

export function GET({ params }) {
	const car = getCarById(params.id);
	if (!car) {
		return json({ message: 'Автомобиль не найден' }, { status: 404 });
	}
	return json({ car });
}
