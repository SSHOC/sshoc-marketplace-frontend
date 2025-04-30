type ValueOf<T> = T[keyof T];

type NonEmptyArray<T> = [T, ...Array<T>];

type MustInclude<T, U extends Array<T>> = [T] extends [ValueOf<U>] ? U : never;

/**
 * @see https://github.com/microsoft/TypeScript/issues/13298#issuecomment-654906323
 */
export function enumerate<T>() {
	return function <U extends NonEmptyArray<T>>(...elements: MustInclude<T, U>): typeof elements {
		return elements;
	};
}
