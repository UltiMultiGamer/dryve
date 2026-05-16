import { writable } from 'svelte/store';

export const currentSession = writable(null);

export async function restoreSession() {
	try {
		const response = await fetch('/api/auth/session');
		if (!response.ok) {
			currentSession.set(null);
			return null;
		}
		const payload = await response.json();
		currentSession.set(payload.user ?? null);
		return payload.user ?? null;
	} catch {
		currentSession.set(null);
		return null;
	}
}

export function setSession(user) {
	currentSession.set(user ?? null);
}
