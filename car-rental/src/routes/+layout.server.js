import { getUserBySession } from '$lib/server/mock-data.js';

export function load({ cookies }) {
	const sessionUser = getUserBySession(cookies.get('dryve_session'));
	return {
		sessionUser
	};
}
