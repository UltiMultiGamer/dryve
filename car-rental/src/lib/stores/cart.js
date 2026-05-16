import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { canAccessCar } from '$lib/stores/memberTier.js';

const STORAGE_KEY = 'dryve_cart';

function readCart() {
	if (!browser) return [];
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
	} catch {
		return [];
	}
}

function persist(items) {
	if (browser) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	}
}

function createCart() {
	const { subscribe, set, update } = writable(readCart());

	return {
		subscribe,
		add(car) {
			if (!canAccessCar(car)) {
				return { ok: false, reason: 'tier' };
			}
			update((items) => {
				const exists = items.some((item) => item.id === car.id);
				const next = exists ? items : [...items, car];
				persist(next);
				return next;
			});
			return { ok: true };
		},
		remove(carId) {
			update((items) => {
				const next = items.filter((item) => item.id !== carId);
				persist(next);
				return next;
			});
		},
		clear() {
			persist([]);
			set([]);
		},
		hydrate() {
			set(readCart());
		}
	};
}

export const cartItems = createCart();
