export function mapBy<T extends object, K extends keyof T>(items: Array<T>, key: K): Map<T[K], T> {
	const map = new Map<T[K], T>();

	items.forEach((item) => {
		const id = item[key];
		map.set(id, item);
	});

	return map;
}
