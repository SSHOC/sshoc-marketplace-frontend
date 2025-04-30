import { ErrorBoundary } from "@stefanprobst/next-error-boundary";
import type { ReactNode } from "react";
import { useQueryErrorResetBoundary } from "react-query";

import { RootErrorFallback } from "@/lib/core/error/RootErrorFallback";

export interface RootErrorBoundaryProps {
	children?: ReactNode;
}

export function RootErrorBoundary(props: RootErrorBoundaryProps): ReactNode {
	const { reset } = useQueryErrorResetBoundary();

	return (
		<ErrorBoundary fallback={RootErrorFallback} onReset={reset}>
			{props.children}
		</ErrorBoundary>
	);
}
