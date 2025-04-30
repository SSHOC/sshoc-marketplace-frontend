export type WithDynamicPropertySearchParams<T> = {
	[K in keyof T]: K extends `d.${string}` ? string : T[K];
};

export function convertDynamicPropertySearchParams<T extends object>(
	searchParams: T,
): WithDynamicPropertySearchParams<T> {
	const query = {} as any;

	Object.entries(searchParams).forEach(([key, value]) => {
		if (key.startsWith("d.") && Array.isArray(value)) {
			query[key] = value.length > 1 ? `(${value.join(" OR ")})` : value[0];
		} else {
			query[key] = value;
		}
	});

	return query as WithDynamicPropertySearchParams<T>;
}
