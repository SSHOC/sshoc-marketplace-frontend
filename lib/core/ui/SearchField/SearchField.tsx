import clearCss from "@/lib/core/ui/ClearButton/ClearButton.module.css";
import css from "@/lib/core/ui/TextField/TextFieldBase.module.css";

import type { Alignment, LabelPosition, NecessityIndicator } from "@react-types/shared";
import { forwardRef, type ForwardedRef, type ReactNode } from "react";
import {
	Button,
	Input,
	SearchField as AriaSearchField,
	type SearchFieldProps as AriaSearchFieldProps,
} from "react-aria-components";

import { AriaField } from "@/lib/core/ui/Field/AriaField";
import type { FieldProps } from "@/lib/core/ui/Field/Field";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import CrossIcon from "@/lib/core/ui/icons/cross";
import MagnifierIcon from "@/lib/core/ui/icons/magnifier";
import { TextFieldControl } from "@/lib/core/ui/TextField/TextFieldBase";

export interface SearchFieldProps
	extends
		Omit<AriaSearchFieldProps, "children" | "render">,
		Pick<FieldProps, "description" | "errorMessage" | "label" | "validationState"> {
	placeholder?: string;
	icon?: ReactNode;
	isRequired?: boolean;
	/** @default 'start' */
	labelAlign?: Alignment;
	labelPosition?: LabelPosition;
	/** @default 'icon' */
	necessityIndicator?: NecessityIndicator;
}

export const SearchField = forwardRef(function SearchField(
	props: SearchFieldProps,
	ref: ForwardedRef<HTMLDivElement>,
): ReactNode {
	const {
		icon = <Icon icon={MagnifierIcon} />,
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
		<AriaSearchField
			{...fieldProps}
			ref={ref}
			isInvalid={isInvalid}
			validationBehavior={validationBehavior}
		>
			{({ isEmpty, isReadOnly }) => (
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
						icon={icon}
						validationState={displayValidation}
						wrapperChildren={
							!isEmpty && !isReadOnly ? (
								<Button
									className={clearCss["clear-button"]}
									excludeFromTabOrder
									preventFocusOnPress
								>
									<Icon icon={CrossIcon} width="0.5em" />
								</Button>
							) : undefined
						}
					>
						<Input className={css["textfield-input"]} placeholder={placeholder} />
					</TextFieldControl>
				</AriaField>
			)}
		</AriaSearchField>
	);
});
