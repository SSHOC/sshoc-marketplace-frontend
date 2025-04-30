import { mergeProps } from "@react-aria/utils";
import type { ReactNode } from "react";
import { useField } from "react-final-form";

import { useFormFieldValidationState } from "@/lib/core/form/useFormFieldValidationState";
import type { SelectProps } from "@/lib/core/ui/Select/Select";
import { Select } from "@/lib/core/ui/Select/Select";

export interface FormSelectProps<T extends object> extends Omit<SelectProps<T>, "selectedKey"> {
	name: string;
}

export function FormSelect<T extends object>(props: FormSelectProps<T>): ReactNode {
	const { input, meta } = useField(props.name);
	const validation = useFormFieldValidationState(meta);

	return (
		<Select<T>
			color="form"
			{...mergeProps(props, {
				onBlur: input.onBlur,
				onFocus: input.onFocus,
				onSelectionChange: input.onChange,
				selectedKey: input.value,
				...validation,
			})}
		/>
	);
}
