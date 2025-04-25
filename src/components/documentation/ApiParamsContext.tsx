import type { ReactNode } from "react";
import { createContext } from "react";

import type { ApiParams } from "@/components/documentation/ApiEndpoint";

export interface ApiParamsContextValue {
	params: ApiParams;
	setParams: (updater: (params: ApiParams) => ApiParams) => void;
}

export const ApiParamsContext = createContext<ApiParamsContextValue | null>(null);

export interface ApiParamsProvider {
	children?: ReactNode;
	value: ApiParamsContextValue;
}

export function ApiParamsProvider(props: ApiParamsProvider): JSX.Element {
	const { children, value } = props;

	return <ApiParamsContext.Provider value={value}>{children}</ApiParamsContext.Provider>;
}
