import pDebounce from "p-debounce";

export function debounce<ArgumentsType extends Array<unknown>, ReturnType>(
	fn: (...args: ArgumentsType) => PromiseLike<ReturnType> | ReturnType,
	wait: number,
	options?: pDebounce.Options,
): (...args: ArgumentsType) => Promise<ReturnType> {
	return pDebounce(fn, wait, options);
}
