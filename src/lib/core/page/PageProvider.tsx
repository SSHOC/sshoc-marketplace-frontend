import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";

import type { UsePageLoadingIndicatorResult } from "@/lib/core/page/usePageLoadingIndicator";
import { usePageLoadingIndicator } from "@/lib/core/page/usePageLoadingIndicator";
import type { UseSkipToMainContentResult } from "@/lib/core/page/useSkipToMainContent";
import { useSkipToMainContent } from "@/lib/core/page/useSkipToMainContent";
import { assert } from "@/lib/utils";

export interface PageContextValue {
	pageLoadingIndicator: UsePageLoadingIndicatorResult;
	skipToMainContent: UseSkipToMainContentResult;
}

export const PageContext = createContext<PageContextValue | null>(null);

export function usePage(): PageContextValue {
	const value = useContext(PageContext);

	assert(value != null, "`usePage` must be nested inside a `PageProvider`.");

	return value;
}

export interface PageProviderProps {
	children?: ReactNode;
}

export function PageProvider(props: PageProviderProps): ReactNode {
	const pageLoadingIndicator = usePageLoadingIndicator();
	const skipToMainContent = useSkipToMainContent();

	const value = useMemo(() => {
		return {
			pageLoadingIndicator,
			skipToMainContent,
		};
	}, [pageLoadingIndicator, skipToMainContent]);

	return <PageContext.Provider value={value}>{props.children}</PageContext.Provider>;
}
