import { useCheckboxGroup, useCheckboxGroupItem } from "@react-aria/checkbox";
import { mergeProps } from "@react-aria/utils";
import type { CheckboxGroupState } from "@react-stately/checkbox";
import { useCheckboxGroupState } from "@react-stately/checkbox";
import type { AriaCheckboxGroupItemProps, AriaCheckboxGroupProps } from "@react-types/checkbox";
import type { NecessityIndicator, Validation } from "@react-types/shared";
import type { ReactElement, ReactNode } from "react";
import { Children, cloneElement, useRef } from "react";

import { CheckBoxBase } from "@/lib/core/ui/CheckBox/CheckBoxBase";
import css from "@/lib/core/ui/CheckBoxGroup/CheckBoxGroup.module.css";
import { Field } from "@/lib/core/ui/Field/Field";

export interface CheckBoxGroupProps extends AriaCheckboxGroupProps, Validation {
	children: Array<ReactElement<CheckBoxGroupItemProps>> | ReactElement<CheckBoxGroupItemProps>;
	necessityIndicator?: NecessityIndicator;
	validationMessage?: ReactNode;
	/** @default "primary" */
	variant?: "facet" | "primary";
}

export function CheckBoxGroup(props: CheckBoxGroupProps): ReactNode {
	const state = useCheckboxGroupState(props);
	const { groupProps, labelProps } = useCheckboxGroup(props, state);

	const variant = props.variant ?? "primary";

	return (
		<Field
			labelElementType="span"
			labelProps={labelProps}
			label={props.label}
			isDisabled={props.isDisabled}
			isRequired={props.isRequired}
			necessityIndicator={props.necessityIndicator}
			validationState={props.validationState}
			// validationMessage={props.validationMessage}
			// errorMessageProps={errorMessageProps}
		>
			<div {...mergeProps(groupProps)} className={css["container"]}>
				{Children.map(props.children, (child) => {
					return cloneElement(child, { state, variant });
				})}
			</div>
		</Field>
	);
}

export interface CheckBoxGroupItemProps extends AriaCheckboxGroupItemProps {
	state?: CheckboxGroupState;
	/** @default "primary" */
	variant?: "facet" | "primary";
}

export function CheckBoxGroupItem(props: CheckBoxGroupItemProps): ReactNode {
	const ref = useRef<HTMLInputElement>(null);

	const state = props.state!;
	const { inputProps } = useCheckboxGroupItem(props, state, ref);
	const isDisabled = props.isDisabled === true || state.isDisabled === true;
	const isSelected = state.isSelected(props.value);

	const variant = props.variant ?? "primary";

	return (
		<CheckBoxBase
			{...props}
			checkBoxRef={ref}
			inputProps={inputProps}
			isDisabled={isDisabled}
			isSelected={isSelected}
			variant={variant}
		/>
	);
}

export { CheckBoxGroupItem as Item };
