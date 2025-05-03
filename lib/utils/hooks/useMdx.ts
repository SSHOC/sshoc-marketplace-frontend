import { runSync } from "@mdx-js/mdx";
import type { MDXModule } from "mdx/types";
import { useMemo } from "react";
import * as runtime from "react/jsx-runtime";

export function useMdx(code: string): MDXModule {
	const element = useMemo(() => {
		return runSync(code, runtime);
	}, [code]);

	return element;
}
