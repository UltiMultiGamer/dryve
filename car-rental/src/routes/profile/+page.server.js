import { redirect } from '@sveltejs/kit';
import { getUserBySession } from '$lib/server/mock-data.js';

export function load({ cookies }) {
	const user = getUserBySession(cookies.get('dryve_session'));
	if (!user) {
		throw redirect(302, '/login?next=/profile');
	}
	return { user };
}
