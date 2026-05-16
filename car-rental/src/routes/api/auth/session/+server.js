import { json } from '@sveltejs/kit';
import { getUserBySession } from '$lib/server/mock-data.js';

export function GET({ cookies }) {
	const token = cookies.get('dryve_session');
	const user = getUserBySession(token);
	if (!user) {
		return json({ message: 'Сессия не найдена' }, { status: 401 });
	}
	return json({ user });
}
