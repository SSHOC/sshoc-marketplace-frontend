import css from "@/lib/core/ui/TextField/TextFieldBase.module.css";

import type {
	Alignment,
	LabelableProps,
	LabelPosition,
	NecessityIndicator,
} from "@react-types/shared";
import type { AriaTextFieldProps } from "@react-types/textfield";
import type { ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import { TextField as AriaTextField, Input } from "react-aria-components";

import { AriaField } from "@/lib/core/ui/Field/AriaField";
import type { TextFieldBaseStyleProps } from "@/lib/core/ui/TextField/TextFieldBase";
import { TextFieldControl } from "@/lib/core/ui/TextField/TextFieldBase";

export interface TextFieldProps extends Omit<AriaTextFieldProps, "errorMessage">, LabelableProps {
	errorMessage?: ReactNode;
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
): ReactNode {
	const {
		color,
		icon,
		size,
		style,
		label,
		description,
		errorMessage,
		labelAlign,
		labelPosition,
		necessityIndicator,
		placeholder,
		validationState,
		validationBehavior = "aria",
		...fieldProps
	} = props;
	const isInvalid = props.isInvalid || validationState === "invalid";
	const displayValidation = isInvalid ? "invalid" : validationState;
	return (
		<AriaTextField
			{...fieldProps}
			ref={forwardedRef}
			isInvalid={isInvalid}
			validationBehavior={validationBehavior}
		>
			<AriaField
				label={label}
				description={description}
				errorMessage={errorMessage}
				labelAlign={labelAlign}
				labelPosition={labelPosition}
				necessityIndicator={necessityIndicator}
				isDisabled={props.isDisabled}
				isRequired={props.isRequired}
				validationState={displayValidation}
			>
				<TextFieldControl
					color={color}
					icon={icon}
					size={size}
					style={style}
					validationState={displayValidation}
				>
					<Input className={css["textfield-input"]} placeholder={placeholder} />
				</TextFieldControl>
			</AriaField>
		</AriaTextField>
	);
});
