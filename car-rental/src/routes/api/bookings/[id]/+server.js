import { json } from '@sveltejs/kit';
import { getUserBySession, updateBookingStatus } from '$lib/server/mock-data.js';

export async function PATCH({ params, request, cookies }) {
	const user = getUserBySession(cookies.get('dryve_session'));
	if (!user) {
		return json({ message: 'Нужна авторизация' }, { status: 401 });
	}

	const { status } = await request.json();
	const booking = updateBookingStatus(params.id, user.id, status ?? 'cancelled');
	if (!booking) {
		return json({ message: 'Бронирование не найдено' }, { status: 404 });
	}
	return json({ booking });
}
