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
import { TextField as AriaTextField, TextArea as AriaTextArea } from "react-aria-components";

import { AriaField } from "@/lib/core/ui/Field/AriaField";
import type { TextFieldBaseStyleProps } from "@/lib/core/ui/TextField/TextFieldBase";
import { TextFieldControl } from "@/lib/core/ui/TextField/TextFieldBase";

export interface TextAreaProps
	extends Omit<AriaTextFieldProps<HTMLTextAreaElement>, "type" | "errorMessage">, LabelableProps {
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
	/** @default 'start' */
	labelAlign?: Alignment;
	labelPosition?: LabelPosition;
	/** @default 'icon' */
	necessityIndicator?: NecessityIndicator;
	rows?: number;
	/** @default 'md' */
	size?: "lg" | "md" | "sm";
	style?: TextFieldBaseStyleProps;
}

export const TextArea = forwardRef(function TextArea(
	props: TextAreaProps,
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
		rows,
		onCopy,
		onCut,
		onPaste,
		onCompositionStart,
		onCompositionEnd,
		onCompositionUpdate,
		onSelect,
		onBeforeInput,
		onInput,
		onFocus,
		onBlur,
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
					<AriaTextArea
						rows={rows}
						onCopy={onCopy}
						onCut={onCut}
						onPaste={onPaste}
						onCompositionStart={onCompositionStart}
						onCompositionEnd={onCompositionEnd}
						onCompositionUpdate={onCompositionUpdate}
						onSelect={onSelect}
						onBeforeInput={onBeforeInput}
						onInput={onInput}
						onFocus={onFocus}
						onBlur={onBlur}
						className={css["textfield-input"]}
						placeholder={placeholder}
					/>
				</TextFieldControl>
			</AriaField>
		</AriaTextField>
	);
});
