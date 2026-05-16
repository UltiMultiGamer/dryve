export async function load({ fetch }) {
	const response = await fetch('/api/cars');
	const payload = await response.json().catch(() => ({}));
	const items = payload.items ?? [];
	const dealCars = [...items]
		.sort((a, b) => b.pricePerDay - a.pricePerDay)
		.slice(0, 4);
	return { dealCars };
}
