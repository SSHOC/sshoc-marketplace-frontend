import { mergeProps } from "@react-aria/utils";
import type { ReactNode } from "react";
import { useField } from "react-final-form";

import { useFormFieldValidationState } from "@/lib/core/form/useFormFieldValidationState";
import type { CheckBoxGroupProps } from "@/lib/core/ui/CheckBoxGroup/CheckBoxGroup";
import { CheckBoxGroup } from "@/lib/core/ui/CheckBoxGroup/CheckBoxGroup";

export interface FormCheckBoxGroupProps extends Omit<CheckBoxGroupProps, "value"> {
	name: string;
}

export function FormCheckBoxGroup(props: FormCheckBoxGroupProps): ReactNode {
	const { input, meta } = useField(props.name);
	const validation = useFormFieldValidationState(meta);

	return (
		<CheckBoxGroup
			color="form"
			{...mergeProps(props, {
				onBlur: input.onBlur,
				onFocus: input.onFocus,
				onChange: input.onChange,
				value: input.value,
				...validation,
			})}
		/>
	);
}

FormCheckBoxGroup.Item = CheckBoxGroup.Item;
