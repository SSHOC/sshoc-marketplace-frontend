import type { MDXComponents } from "mdx/types";

import { Link } from "@/lib/navigation";

const shared = {
	a: Link,
} as MDXComponents;

export function useMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...shared,
		...components,
	};
}
