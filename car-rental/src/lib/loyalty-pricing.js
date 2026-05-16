/** @param {'go' | 'beyond' | 'infinite' | string} tier */
export function discountFractionForTier(tier) {
	if (tier === 'infinite') return 0.88;
	if (tier === 'beyond') return 0.92;
	return 0.95;
}

/** @param {'go' | 'beyond' | 'infinite' | string} tier */
export function tierDiscountPercent(tier) {
	if (tier === 'infinite') return 12;
	if (tier === 'beyond') return 8;
	return 5;
}

/** @param {{ pricePerDay: number }} car @param {string} tier */
export function effectiveDailyRate(car, tier) {
	return Math.round(car.pricePerDay * discountFractionForTier(tier));
}
