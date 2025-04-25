export function groupBy<T extends object, K extends keyof T>(
	items: Array<T>,
	key: K,
): Map<T[K], Array<T>> {
	const map = new Map<T[K], Array<T>>();

	items.forEach((item) => {
		const id = item[key];
		if (map.has(id)) {
			map.get(id)!.push(item);
		} else {
			map.set(id, [item]);
		}
	});

	return map;
}
