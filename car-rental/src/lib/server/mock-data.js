import { effectiveDailyRate } from '$lib/loyalty-pricing.js';

/** @typedef {{ id: string; name: string; class: string; year: number; mileageKm: number; drive: string; body: string; transmission: string; engine: string; pricePerDay: number; seats: number; fuel: string; image: string; gallery?: string[]; description: string; segment: 'economy' | 'comfort' | 'premium' | 'sport'; tags?: string[]; memberRankRequired?: number }} Car */

/** @type {Car[]} */
const cars = [
	{
		id: 'car-toyota-camry',
		name: 'Toyota Camry',
		class: 'Седан',
		year: 2022,
		mileageKm: 42900,
		drive: 'Передний привод',
		body: 'Седан',
		transmission: 'Автомат',
		engine: '2.5 л, 200 л.с.',
		pricePerDay: 5400,
		seats: 5,
		fuel: 'Бензин',
		image: '/images/generic/toyota_camry_1_1.webp',
		gallery: ['/images/generic/toyota_camry_2_2.webp', '/images/generic/toyota_camry_3_3.webp'],
		segment: 'comfort',
		tags: ['Комфорт', 'Семья'],
		description: 'Комфортный городской седан для поездок по городу и трассе.'
	},
	{
		id: 'car-honda-civic',
		name: 'Honda Civic',
		class: 'Седан',
		year: 2021,
		mileageKm: 51500,
		drive: 'Передний привод',
		body: 'Седан',
		transmission: 'Автомат',
		engine: '2.0 л, 158 л.с.',
		pricePerDay: 3600,
		seats: 5,
		fuel: 'Бензин',
		image: '/images/generic/honda_civic_1_4.webp',
		gallery: ['/images/generic/honda_civic_2_5.webp'],
		segment: 'economy',
		tags: ['Эконом'],
		description: 'Экономичный и практичный седан для ежедневных поездок.'
	},
	{
		id: 'car-ford-escape',
		name: 'Ford Escape',
		class: 'Кроссовер',
		year: 2022,
		mileageKm: 27400,
		drive: 'Полный привод',
		body: 'Кроссовер',
		transmission: 'Автомат',
		engine: '2.0 л, 250 л.с.',
		pricePerDay: 6200,
		seats: 5,
		fuel: 'Бензин',
		image: '/images/generic/ford_escape_1_12.webp',
		gallery: ['/images/generic/ford_escape_2_13.webp', '/images/generic/ford_escape_3_14.webp'],
		segment: 'comfort',
		tags: ['Комфорт', 'Клиренс'],
		description: 'Универсальный кроссовер для города и лёгкого бездорожья.'
	},
	{
		id: 'car-hyundai-elantra',
		name: 'Hyundai Elantra',
		class: 'Седан',
		year: 2021,
		mileageKm: 38900,
		drive: 'Передний привод',
		body: 'Седан',
		transmission: 'Автомат',
		engine: '1.6 л, 128 л.с.',
		pricePerDay: 3200,
		seats: 5,
		fuel: 'Бензин',
		image: '/images/generic/hyundai_elantra_1_9.webp',
		gallery: ['/images/generic/hyundai_elantra_2_10.webp', '/images/generic/hyundai_elantra_3_11.webp'],
		segment: 'economy',
		tags: ['Эконом'],
		description: 'Сбалансированный седан с низкой стоимостью аренды.'
	},
	{
		id: 'car-vw-jetta',
		name: 'Volkswagen Jetta',
		class: 'Седан',
		year: 2020,
		mileageKm: 67400,
		drive: 'Передний привод',
		body: 'Седан',
		transmission: 'Автомат',
		engine: '1.4 л, 150 л.с.',
		pricePerDay: 3100,
		seats: 5,
		fuel: 'Бензин',
		image: '/images/generic/vw_jetta_1_15.webp',
		gallery: ['/images/generic/vw_jetta_2_16.webp'],
		segment: 'economy',
		tags: ['Эконом'],
		description: 'Практичный седан для города и дальних поездок.'
	},
	{
		id: 'car-bentley',
		name: 'Bentley Continental GT',
		class: 'Купе',
		year: 2023,
		mileageKm: 8200,
		drive: 'Полный привод',
		body: 'Купе',
		transmission: 'Автомат',
		engine: '6.0 л, 635 л.с.',
		pricePerDay: 28500,
		seats: 4,
		fuel: 'Бензин',
		image: '/images/luxury/bentley_1_4.webp',
		gallery: ['/images/luxury/bentley_2_5.webp', '/images/luxury/bentley_3_6.webp'],
		segment: 'premium',
		tags: ['Премиум', 'Люкс'],
		memberRankRequired: 1,
		description: 'Флагманский купе-класс для особых мероприятий. Доступен участникам Dryve Beyond и выше (не входит в линейку Infinite).'
	},
	{
		id: 'car-ferrari-f8',
		name: 'Ferrari F8 Tributo',
		class: 'Суперкар',
		year: 2023,
		mileageKm: 4200,
		drive: 'Задний привод',
		body: 'Купе',
		transmission: 'Робот',
		engine: '3.9 л, 720 л.с.',
		pricePerDay: 42000,
		seats: 2,
		fuel: 'Бензин',
		image: '/images/luxury/ferrari_f8_1_9.webp',
		gallery: [
			'/images/luxury/ferrari_f8_2_10.webp',
			'/images/luxury/ferrari_f8_3_11.webp',
			'/images/luxury/ferrari_f8_4_13.webp',
			'/images/luxury/ferrari_f8_5_14.webp',
			'/images/luxury/ferrari_f8_6_15.webp'
		],
		segment: 'sport',
		tags: ['Суперкар', 'Премиум'],
		memberRankRequired: 2,
		description: 'Иконичный суперкар. Бронирование только для участников Dryve Infinite.'
	},
	{
		id: 'car-mercedes-s',
		name: 'Mercedes-Benz S-Class',
		class: 'Седан',
		year: 2024,
		mileageKm: 12800,
		drive: 'Полный привод',
		body: 'Седан',
		transmission: 'Автомат',
		engine: '3.0 л, 435 л.с.',
		pricePerDay: 9900,
		seats: 5,
		fuel: 'Бензин',
		image: '/images/luxury/mercedes_s_class_1_7.webp',
		gallery: ['/images/luxury/mercedes_s_class_2_8.webp'],
		segment: 'premium',
		tags: ['Премиум', 'Бизнес'],
		description: 'Репрезентативный седан для деловых поездок и трансферов.'
	},
	{
		id: 'car-range-rover',
		name: 'Range Rover',
		class: 'Внедорожник',
		year: 2023,
		mileageKm: 19800,
		drive: 'Полный привод',
		body: 'Внедорожник',
		transmission: 'Автомат',
		engine: '3.0 л, 400 л.с.',
		pricePerDay: 14200,
		seats: 5,
		fuel: 'Бензин',
		image: '/images/luxury/range_rover_1_12.webp',
		segment: 'premium',
		tags: ['Премиум', 'Off-road'],
		description: 'Полноразмерный внедорожник премиум-класса для любых дорог.'
	},
	{
		id: 'car-rolls-royce',
		name: 'Rolls-Royce Ghost',
		class: 'Седан',
		year: 2024,
		mileageKm: 5100,
		drive: 'Задний привод',
		body: 'Седан',
		transmission: 'Автомат',
		engine: '6.75 л, 571 л.с.',
		pricePerDay: 35000,
		seats: 5,
		fuel: 'Бензин',
		image: '/images/luxury/rolls_royce_1_1.webp',
		gallery: ['/images/luxury/rolls_royce_2_2.webp', '/images/luxury/rolls_royce_3_3.webp'],
		segment: 'premium',
		tags: ['Премиум', 'Люкс'],
		memberRankRequired: 2,
		description: 'Абсолютный люкс. Доступен только участникам Dryve Infinite.'
	},
	{
		id: 'car-audi-r8',
		name: 'Audi R8',
		class: 'Суперкар',
		year: 2022,
		mileageKm: 9600,
		drive: 'Полный привод',
		body: 'Купе',
		transmission: 'Робот',
		engine: '5.2 л, 620 л.с.',
		pricePerDay: 26500,
		seats: 2,
		fuel: 'Бензин',
		image: '/images/sports/audi_r8_1_15.webp',
		gallery: ['/images/sports/audi_r8_2_16.webp'],
		segment: 'sport',
		tags: ['Спорт', 'Премиум'],
		memberRankRequired: 1,
		description: 'Среднемоторное купе с характерным звуком V10. Только для Dryve Beyond и выше.'
	},
	{
		id: 'car-bmw-m4',
		name: 'BMW M4 Competition',
		class: 'Купе',
		year: 2023,
		mileageKm: 11200,
		drive: 'Задний привод',
		body: 'Купе',
		transmission: 'Автомат',
		engine: '3.0 л, 510 л.с.',
		pricePerDay: 11800,
		seats: 4,
		fuel: 'Бензин',
		image: '/images/sports/bmw_m4_1_9.webp',
		gallery: ['/images/sports/bmw_m4_2_10.webp', '/images/sports/bmw_m4_3_11.webp'],
		segment: 'sport',
		tags: ['Спорт'],
		description: 'Драйверское купе для трека и города.'
	},
	{
		id: 'car-corvette',
		name: 'Chevrolet Corvette',
		class: 'Купе',
		year: 2022,
		mileageKm: 8900,
		drive: 'Задний привод',
		body: 'Купе',
		transmission: 'Автомат',
		engine: '6.2 л, 502 л.с.',
		pricePerDay: 13400,
		seats: 2,
		fuel: 'Бензин',
		image: '/images/sports/chevrolet_corvette_1_7.webp',
		gallery: ['/images/sports/chevrolet_corvette_2_8.webp'],
		segment: 'sport',
		tags: ['Спорт'],
		description: 'Американская икона производительности.'
	},
	{
		id: 'car-mustang',
		name: 'Ford Mustang',
		class: 'Купе',
		year: 2021,
		mileageKm: 24100,
		drive: 'Задний привод',
		body: 'Купе',
		transmission: 'Автомат',
		engine: '5.0 л, 450 л.с.',
		pricePerDay: 7800,
		seats: 4,
		fuel: 'Бензин',
		image: '/images/sports/ford_mustang_1_4.webp',
		gallery: ['/images/sports/ford_mustang_2_5.webp', '/images/sports/ford_mustang_3_6.webp'],
		segment: 'sport',
		tags: ['Спорт'],
		description: 'Классическое купе с мощным V8.'
	},
	{
		id: 'car-nissan-gtr',
		name: 'Nissan GT-R',
		class: 'Купе',
		year: 2021,
		mileageKm: 17800,
		drive: 'Полный привод',
		body: 'Купе',
		transmission: 'Робот',
		engine: '3.8 л, 600 л.с.',
		pricePerDay: 15200,
		seats: 4,
		fuel: 'Бензин',
		image: '/images/sports/nissan_gtr_1_12.webp',
		gallery: ['/images/sports/nissan_gtr_2_13.webp', '/images/sports/nissan_gtr_3_14.webp'],
		segment: 'sport',
		tags: ['Спорт', 'Премиум'],
		memberRankRequired: 1,
		description: 'Легендарный японский спорткар. Доступен участникам Dryve Beyond и выше.'
	},
	{
		id: 'car-porsche-911',
		name: 'Porsche 911 Carrera',
		class: 'Купе',
		year: 2024,
		mileageKm: 6200,
		drive: 'Задний привод',
		body: 'Купе',
		transmission: 'Робот',
		engine: '3.0 л, 385 л.с.',
		pricePerDay: 16800,
		seats: 4,
		fuel: 'Бензин',
		image: '/images/sports/porsche_911_1_1.webp',
		gallery: ['/images/sports/porsche_911_2_2.webp', '/images/sports/porsche_911_3_3.webp'],
		segment: 'sport',
		tags: ['Спорт', 'Премиум'],
		description: 'Эталон спортивного купе для дорог и серпантинов.'
	}
];

const users = [
	{
		id: 'user-1',
		name: 'Fedor Vasilenko',
		email: 'demo@dryve.app',
		password: '123456'
	}
];

const sessions = new Map();

const bookings = [];

function createSessionToken() {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function listCars(filters) {
	return cars.filter((car) => {
		if (filters.search) {
			const query = filters.search.toLowerCase();
			const tagStr = (car.tags ?? []).join(' ').toLowerCase();
			const haystack =
				`${car.name} ${car.class} ${car.body} ${car.drive} ${car.engine} ${tagStr}`.toLowerCase();
			if (!haystack.includes(query)) return false;
		}
		if (filters.class && car.class !== filters.class) return false;
		if (filters.transmission && car.transmission !== filters.transmission) return false;
		if (filters.body && car.body !== filters.body) return false;
		if (filters.drive && car.drive !== filters.drive) return false;
		if (filters.fuel && car.fuel !== filters.fuel) return false;
		if (filters.seatsMin && car.seats < Number(filters.seatsMin)) return false;
		if (filters.yearMin && car.year < Number(filters.yearMin)) return false;
		if (filters.priceMax && car.pricePerDay > Number(filters.priceMax)) return false;
		return true;
	});
}

export function getCarById(id) {
	return cars.find((car) => car.id === id) ?? null;
}

export function getAvailableFilters() {
	const prices = cars.map((car) => car.pricePerDay);
	const seatVals = [...new Set(cars.map((car) => car.seats))].sort((a, b) => a - b);
	const seatsFleetMin = seatVals.length ? seatVals[0] : 2;
	const seatsFleetMax = seatVals.length ? seatVals[seatVals.length - 1] : 7;
	let seatsSliderMin = seatsFleetMin;
	let seatsSliderMax = seatsFleetMax;
	if (seatsFleetMin === seatsFleetMax) {
		seatsSliderMin = 2;
		seatsSliderMax = 9;
	}
	return {
		classes: [...new Set(cars.map((car) => car.class))],
		transmissions: [...new Set(cars.map((car) => car.transmission))],
		bodies: [...new Set(cars.map((car) => car.body))],
		drives: [...new Set(cars.map((car) => car.drive))],
		fuels: [...new Set(cars.map((car) => car.fuel))],
		seats: seatVals,
		seatsFleetMin,
		seatsFleetMax,
		seatsSlider: { min: seatsSliderMin, max: seatsSliderMax },
		years: [...new Set(cars.map((car) => car.year))].sort((a, b) => b - a),
		priceRange: {
			min: Math.min(...prices),
			max: Math.max(...prices)
		}
	};
}

export function createSession(email, password) {
	const user = users.find((item) => item.email === email && item.password === password);
	if (!user) return null;
	const token = createSessionToken();
	sessions.set(token, user.id);
	return {
		token,
		user: {
			id: user.id,
			name: user.name,
			email: user.email
		}
	};
}

export function getUserBySession(token) {
	if (!token || !sessions.has(token)) return null;
	const userId = sessions.get(token);
	const user = users.find((item) => item.id === userId);
	if (!user) return null;
	return {
		id: user.id,
		name: user.name,
		email: user.email
	};
}

export function clearSession(token) {
	if (token) sessions.delete(token);
}

export function createBooking({ userId, carId, from, to, loyaltyTier = 'go' }) {
	const car = getCarById(carId);
	if (!car) return null;
	const fromDate = new Date(from);
	const toDate = new Date(to);
	const diff = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
	const days = Number.isFinite(diff) && diff > 0 ? diff : 1;
	const daily = effectiveDailyRate(car, loyaltyTier);
	const total = days * daily;
	const booking = {
		id: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		userId,
		carId,
		carName: car.name,
		from,
		to,
		days,
		total,
		status: 'confirmed',
		createdAt: new Date().toISOString()
	};
	bookings.unshift(booking);
	return booking;
}

export function listBookingsByUser(userId) {
	return bookings.filter((item) => item.userId === userId);
}

export function updateBookingStatus(bookingId, userId, status) {
	const booking = bookings.find((item) => item.id === bookingId && item.userId === userId);
	if (!booking) return null;
	booking.status = status;
	return booking;
}
