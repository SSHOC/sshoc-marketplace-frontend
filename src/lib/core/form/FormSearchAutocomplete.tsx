import { mergeProps } from "@react-aria/utils";
import type { ReactNode } from "react";
import { useField } from "react-final-form";

import { useFormFieldValidationState } from "@/lib/core/form/useFormFieldValidationState";
import type { SearchAutocompleteProps } from "@/lib/core/ui/SearchAutocomplete/SearchAutocomplete";
import { SearchAutocomplete } from "@/lib/core/ui/SearchAutocomplete/SearchAutocomplete";

// FIXME:;do we actually want this? does not really make sense

export interface FormSearchAutocompleteProps<T extends object>
	extends Omit<SearchAutocompleteProps<T>, "inputValue"> {
	name: string;
}

export function FormSearchAutocomplete<T extends object>(
	props: FormSearchAutocompleteProps<T>,
): ReactNode {
	const { input, meta } = useField(props.name);
	const validation = useFormFieldValidationState(meta);

	return (
		<SearchAutocomplete<T>
			color="form"
			{...mergeProps(props, {
				onBlur: input.onBlur,
				onFocus: input.onFocus,
				onInputChange: input.onChange,
				inputValue: input.value,
				...validation,
			})}
		/>
	);
}
