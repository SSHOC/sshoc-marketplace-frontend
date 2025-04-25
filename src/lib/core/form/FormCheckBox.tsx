import { mergeProps } from "@react-aria/utils";
import { useField } from "react-final-form";

import { useFormFieldValidationState } from "@/lib/core/form/useFormFieldValidationState";
import type { CheckBoxProps } from "@/lib/core/ui/CheckBox/CheckBox";
import { CheckBox } from "@/lib/core/ui/CheckBox/CheckBox";

export interface FormCheckBoxProps extends Omit<CheckBoxProps, "isSelected"> {
	name: string;
}

export function FormCheckBox(props: FormCheckBoxProps): JSX.Element {
	const { input, meta } = useField(props.name, { type: "checkbox" });
	const validation = useFormFieldValidationState(meta);

	return (
		<CheckBox
			color="form"
			{...mergeProps(props, {
				onBlur: input.onBlur,
				onFocus: input.onFocus,
				onChange: input.onChange,
				isSelected: input.checked,
				...validation,
			})}
		/>
	);
}
