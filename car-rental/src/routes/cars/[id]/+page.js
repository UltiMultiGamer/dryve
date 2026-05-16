import { error } from '@sveltejs/kit';

export async function load({ fetch, params }) {
	const response = await fetch(`/api/cars/${params.id}`);
	if (!response.ok) {
		throw error(404, 'Автомобиль не найден');
	}
	const payload = await response.json();
	return { car: payload.car };
}
