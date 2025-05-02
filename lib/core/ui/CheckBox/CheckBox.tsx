import { useCheckbox } from "@react-aria/checkbox";
import { useToggleState } from "@react-stately/toggle";
import type { AriaCheckboxProps } from "@react-types/checkbox";
import type { NecessityIndicator } from "@react-types/shared";
import type { ReactNode } from "react";
import { useRef } from "react";

import { CheckBoxBase } from "@/lib/core/ui/CheckBox/CheckBoxBase";

export interface CheckBoxProps extends AriaCheckboxProps {
	validationMessage?: ReactNode;
	necessityIndicator?: NecessityIndicator;
	/** @default 'primary' */
	variant?: "facet" | "primary";
}

export function CheckBox(props: CheckBoxProps): ReactNode {
	const ref = useRef<HTMLInputElement>(null);
	const state = useToggleState(props);
	const { inputProps } = useCheckbox(props, state, ref);
	const isDisabled = props.isDisabled === true;
	const isSelected = state.isSelected;

	return (
		<CheckBoxBase
			{...props}
			checkBoxRef={ref}
			inputProps={inputProps}
			isDisabled={isDisabled}
			isSelected={isSelected}
		/>
	);
}
