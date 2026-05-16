import { json } from '@sveltejs/kit';
import { createSession } from '$lib/server/mock-data.js';

export async function POST({ request, cookies }) {
	const { email, password } = await request.json();

	const session = createSession(email, password);
	if (!session) {
		return json({ message: 'Неверный email или пароль' }, { status: 401 });
	}

	cookies.set('dryve_session', session.token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24
	});

	return json({ user: session.user });
}
