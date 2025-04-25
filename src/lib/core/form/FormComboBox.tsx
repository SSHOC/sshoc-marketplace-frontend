import { mergeProps } from "@react-aria/utils";
import { useField } from "react-final-form";

import { useFormFieldValidationState } from "@/lib/core/form/useFormFieldValidationState";
import type { ComboBoxProps } from "@/lib/core/ui/ComboBox/ComboBox";
import { ComboBox } from "@/lib/core/ui/ComboBox/ComboBox";

export interface FormComboBoxProps<T extends object> extends Omit<ComboBoxProps<T>, "selectedKey"> {
	name: string;
}

export function FormComboBox<T extends object>(props: FormComboBoxProps<T>): JSX.Element {
	const { input, meta } = useField(props.name);
	const validation = useFormFieldValidationState(meta);

	return (
		<ComboBox<T>
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
