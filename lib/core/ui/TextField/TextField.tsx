import { useTextField } from "@react-aria/textfield";
import type { LabelableProps } from "@react-types/shared";
import type { AriaTextFieldProps } from "@react-types/textfield";
import type { ForwardedRef, ReactNode } from "react";
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
	icon?: ReactNode;
	isRequired?: boolean;
	/** @default 'md' */
	size?: "lg" | "md" | "sm";
	style?: TextFieldBaseStyleProps;
}

export const TextField = forwardRef(function TextField(
	props: TextFieldProps,
	forwardedRef: ForwardedRef<HTMLDivElement>,
): ReactNode {
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
