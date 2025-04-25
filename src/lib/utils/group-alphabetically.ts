export function groupAlphabetically<T>(obj: Record<string, T>): Record<string, Record<string, T>> {
	const grouped: Record<string, Record<string, T>> = {};

	Object.entries(obj).forEach(([key, value]) => {
		const charCode = key.codePointAt(0);
		if (charCode === undefined) {
			return;
		}
		const firstChar = String.fromCharCode(charCode);
		if (!Object.prototype.hasOwnProperty.call(grouped, firstChar)) {
			grouped[firstChar] = {};
		}

		grouped[firstChar]![key] = value;
	});

	return grouped;
}
