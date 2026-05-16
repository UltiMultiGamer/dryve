import { json } from '@sveltejs/kit';
import { clearSession } from '$lib/server/mock-data.js';

export function POST({ cookies }) {
	const token = cookies.get('dryve_session');
	clearSession(token);
	cookies.delete('dryve_session', { path: '/' });
	return json({ success: true });
}
