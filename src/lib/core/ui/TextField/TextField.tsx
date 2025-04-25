import { useTextField } from "@react-aria/textfield";
import type {
	Alignment,
	LabelableProps,
	LabelPosition,
	NecessityIndicator,
} from "@react-types/shared";
import type { AriaTextFieldProps } from "@react-types/textfield";
import type { ForwardedRef } from "react";
import { forwardRef, useRef } from "react";

import type { TextFieldBaseStyleProps } from "@/lib/core/ui/TextField/TextFieldBase";
import { TextFieldBase } from "@/lib/core/ui/TextField/TextFieldBase";

export interface TextFieldProps extends AriaTextFieldProps, LabelableProps {
	/** @default 'primary' */
	color?:
		| "form"
		| "primary"
		| "review changed"
		| "review deleted"
		| "review inserted"
		| "review unchanged";
	icon?: JSX.Element;
	isRequired?: boolean;
	labelAlign?: Alignment;
	/** @default 'icon' */
	labelPosition?: LabelPosition;
	/** @default 'start' */
	necessityIndicator?: NecessityIndicator;
	/** @default 'md' */
	size?: "lg" | "md" | "sm";
	style?: TextFieldBaseStyleProps;
}

export const TextField = forwardRef(function TextField(
	props: TextFieldProps,
	forwardedRef: ForwardedRef<HTMLDivElement>,
): JSX.Element {
	const inputRef = useRef<HTMLInputElement>(null);
	const { descriptionProps, errorMessageProps, inputProps, labelProps } = useTextField(
		props,
		inputRef,
	);

	return (
		<TextFieldBase
			ref={forwardedRef}
			{...props}
			descriptionProps={descriptionProps}
			errorMessageProps={errorMessageProps}
			inputProps={inputProps}
			inputRef={inputRef}
			labelProps={labelProps}
		/>
	);
});
