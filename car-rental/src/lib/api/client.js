import { setSession } from '$lib/stores/session.js';

async function parseResponse(response) {
	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		throw new Error(data.message || 'Request failed');
	}
	return data;
}

export async function fetchCars(filters = {}) {
	const params = new URLSearchParams();
	Object.entries(filters).forEach(([key, value]) => {
		if (value !== undefined && value !== null && String(value).trim() !== '') {
			params.set(key, String(value));
		}
	});
	const query = params.toString();
	const response = await fetch(`/api/cars${query ? `?${query}` : ''}`);
	return parseResponse(response);
}

export async function fetchCarById(id) {
	const response = await fetch(`/api/cars/${id}`);
	return parseResponse(response);
}

export async function login(credentials) {
	const response = await fetch('/api/auth/login', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(credentials)
	});
	const data = await parseResponse(response);
	setSession(data.user);
	return data;
}

export async function logout() {
	await fetch('/api/auth/logout', { method: 'POST' });
	setSession(null);
}

export async function createBooking(payload) {
	const response = await fetch('/api/bookings', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload)
	});
	return parseResponse(response);
}

export async function fetchMyBookings() {
	const response = await fetch('/api/bookings');
	return parseResponse(response);
}

export async function cancelBooking(bookingId) {
	const response = await fetch(`/api/bookings/${bookingId}`, {
		method: 'PATCH',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ status: 'cancelled' })
	});
	return parseResponse(response);
}
