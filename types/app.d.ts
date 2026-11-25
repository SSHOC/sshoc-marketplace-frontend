type DeepNonNullable<T> = {
	[K in keyof T]-?: NonNullable<T[K]>;
};

type KeysAllowUndefined<T> = {
	[K in keyof T]: T[K] | undefined;
};

type Nullable<T> = {
	[K in keyof T]?: T[K] | null | undefined;
};

type Mutable<T> = {
	-readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? Array<Mutable<U>> : Mutable<T[P]>;
};

type RemoveIndexSignature<T> = {
	[Key in keyof T as string extends Key ? never : Key]: T[Key];
};

type RequiredKeysAllowUndefined<T> = {
	[K in keyof T]: undefined extends T[K] ? T[K] : T[K] | undefined;
};

type UndefinedLeaves<T> = {
	[K in keyof T]: undefined extends T[K]
		? never
		: T[K] extends Array<unknown>
			? []
			: T[K] extends object
				? UndefinedLeaves<T[K]>
				: undefined;
};

type Primitive = boolean | number | string;

type ParamsInput = Record<string, Primitive | ReadonlyArray<Primitive>>;

type StringParams<T extends ParamsInput> = {
	[K in keyof T as string extends K ? never : K]: Exclude<T[K], undefined> extends Primitive
		? string
		: ReadonlyArray<string>;
};

declare module "*.mdx" {
	import type { MDXContent } from "mdx/types";

	const content: MDXContent;
	const metadata: { title: string };

	export default content;
	export { metadata };
}
