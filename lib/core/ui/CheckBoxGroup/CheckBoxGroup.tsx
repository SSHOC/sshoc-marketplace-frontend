import css from "@/lib/core/ui/CheckBoxGroup/CheckBoxGroup.module.css";

import type { AriaCheckboxGroupItemProps, AriaCheckboxGroupProps } from "@react-types/checkbox";
import type { NecessityIndicator } from "@react-types/shared";
import type { ReactElement, ReactNode } from "react";
import { Children, cloneElement } from "react";
import { CheckboxGroup } from "react-aria-components";

import { CheckBox } from "@/lib/core/ui/CheckBox/CheckBox";
import { AriaField } from "@/lib/core/ui/Field/AriaField";

export interface CheckBoxGroupProps extends Omit<AriaCheckboxGroupProps, "errorMessage"> {
	errorMessage?: ReactNode;
	children: Array<ReactElement<CheckBoxGroupItemProps>> | ReactElement<CheckBoxGroupItemProps>;
	necessityIndicator?: NecessityIndicator;
	validationMessage?: ReactNode;
	variant?: "facet" | "primary";
}

export function CheckBoxGroup(props: CheckBoxGroupProps): ReactNode {
	const {
		children,
		label,
		description,
		errorMessage,
		validationMessage,
		necessityIndicator,
		validationState,
		validationBehavior = "aria",
		variant = "primary",
		...groupProps
	} = props;
	const isInvalid = props.isInvalid || validationState === "invalid";
	return (
		<CheckboxGroup {...groupProps} isInvalid={isInvalid} validationBehavior={validationBehavior}>
			<AriaField
				label={label}
				description={description}
				errorMessage={errorMessage ?? validationMessage}
				isDisabled={props.isDisabled}
				isRequired={props.isRequired}
				necessityIndicator={necessityIndicator}
				validationState={isInvalid ? "invalid" : validationState}
			>
				<div className={css["container"]}>
					{Children.map(children, (child) =>
						cloneElement<CheckBoxGroupItemProps>(child, { variant }),
					)}
				</div>
			</AriaField>
		</CheckboxGroup>
	);
}

export interface CheckBoxGroupItemProps extends AriaCheckboxGroupItemProps {
	variant?: "facet" | "primary";
}

export function CheckBoxGroupItem(props: CheckBoxGroupItemProps): ReactNode {
	return <CheckBox {...props} />;
}

export { CheckBoxGroupItem as Item };
