import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';

const STORAGE_KEY = 'dryve_member_tier';
const COOKIE_NAME = 'dryve_member_tier';

export const MEMBER_TIERS = ['go', 'beyond', 'infinite'];

function readCookieTier() {
	if (!browser) return null;
	try {
		const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
		const raw = m?.[1] ? decodeURIComponent(m[1]) : '';
		if (raw && MEMBER_TIERS.includes(/** @type {any} */ (raw))) return raw;
	} catch {
		/* ignore */
	}
	return null;
}

function writeCookieTier(tier) {
	if (!browser) return;
	document.cookie = `${COOKIE_NAME}=${encodeURIComponent(tier)};path=/;max-age=31536000;SameSite=Lax`;
}

function rankFromTier(tier) {
	if (tier === 'infinite') return 2;
	if (tier === 'beyond') return 1;
	return 0;
}

function readTier() {
	if (!browser) return 'go';
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw && MEMBER_TIERS.includes(/** @type {any} */ (raw))) return raw;
	} catch {
		/* ignore */
	}
	const fromCookie = readCookieTier();
	if (fromCookie) return fromCookie;
	return 'go';
}

export const memberTier = writable(readTier());

export function hydrateMemberTier() {
	const t = readTier();
	memberTier.set(t);
	if (browser) {
		writeCookieTier(t);
	}
}

/** @param {'go' | 'beyond' | 'infinite'} tier */
export function setMemberTier(tier) {
	if (!MEMBER_TIERS.includes(/** @type {any} */ (tier))) return;
	memberTier.set(tier);
	if (browser) {
		localStorage.setItem(STORAGE_KEY, tier);
		writeCookieTier(tier);
	}
}

/** @param {{ memberRankRequired?: number }} car */
export function canAccessCar(car) {
	const need = Number(car?.memberRankRequired) || 0;
	const tier = get(memberTier);
	return rankFromTier(tier) >= need;
}

export function requiredTierLabel(memberRankRequired) {
	const n = Number(memberRankRequired) || 0;
	if (n >= 2) return 'Dryve Infinite';
	if (n >= 1) return 'Dryve Beyond';
	return null;
}
