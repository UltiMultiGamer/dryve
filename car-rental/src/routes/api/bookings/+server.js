import { json } from '@sveltejs/kit';
import { createBooking, getUserBySession, listBookingsByUser } from '$lib/server/mock-data.js';

export function GET({ cookies }) {
	const user = getUserBySession(cookies.get('dryve_session'));
	if (!user) {
		return json({ message: 'Нужна авторизация' }, { status: 401 });
	}
	return json({ items: listBookingsByUser(user.id) });
}

export async function POST({ request, cookies }) {
	const user = getUserBySession(cookies.get('dryve_session'));
	if (!user) {
		return json({ message: 'Нужна авторизация' }, { status: 401 });
	}

	const { carId, from, to } = await request.json();
	if (!carId || !from || !to) {
		return json({ message: 'Заполните даты и автомобиль' }, { status: 400 });
	}

	const tierRaw = cookies.get('dryve_member_tier') ?? 'go';
	const loyaltyTier = ['go', 'beyond', 'infinite'].includes(tierRaw) ? tierRaw : 'go';

	const booking = createBooking({ userId: user.id, carId, from, to, loyaltyTier });
	if (!booking) {
		return json({ message: 'Не удалось создать бронирование' }, { status: 404 });
	}
	return json({ booking }, { status: 201 });
}
