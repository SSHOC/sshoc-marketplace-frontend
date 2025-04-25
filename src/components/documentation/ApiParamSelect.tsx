import type { Key } from "react";

import { useApiParams } from "@/components/documentation/useApiParams";
import type { SelectProps } from "@/lib/core/ui/Select/Select";
import { Select } from "@/lib/core/ui/Select/Select";

export interface ApiParamSelectProps<T extends object>
	extends Pick<SelectProps<T>, "aria-label" | "items" | "label" | "placeholder"> {
	param: string;
	children: Array<JSX.Element> | JSX.Element;
}

export function ApiParamSelect<T extends object>(props: ApiParamSelectProps<T>): JSX.Element {
	const { param } = props;

	const { params, setParams } = useApiParams();

	const value = params[param] as Key | undefined;

	function onChange(value: Key) {
		setParams((params) => {
			return { ...params, [param]: value };
		});
	}

	return <Select {...props} size="sm" selectedKey={value} onSelectionChange={onChange} />;
}
