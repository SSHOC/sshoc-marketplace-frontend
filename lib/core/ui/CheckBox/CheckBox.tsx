import css from "@/lib/core/ui/CheckBox/CheckBoxBase.module.css";

import type { AriaCheckboxProps } from "@react-types/checkbox";
import type { NecessityIndicator } from "@react-types/shared";
import type { ReactNode } from "react";
import { Checkbox, CheckboxButton, CheckboxField } from "react-aria-components";

import { AriaField } from "@/lib/core/ui/Field/AriaField";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import CheckMarkIcon from "@/lib/core/ui/icons/checkmark";
import DashIcon from "@/lib/core/ui/icons/dash";
import { RequiredIndicator } from "@/lib/core/ui/RequiredIndicator/RequiredIndicator";

export interface CheckBoxProps extends Omit<AriaCheckboxProps, "errorMessage"> {
	errorMessage?: ReactNode;
	description?: ReactNode;
	validationMessage?: ReactNode;
	necessityIndicator?: NecessityIndicator;
	variant?: "facet" | "primary";
}

export function CheckBox(props: CheckBoxProps): ReactNode {
	const {
		children,
		description,
		errorMessage,
		necessityIndicator,
		validationMessage,
		validationState,
		validationBehavior = "aria",
		variant = "primary",
		...checkboxProps
	} = props;
	const isInvalid = props.isInvalid || validationState === "invalid";
	const content = ({
		isIndeterminate,
		isSelected,
		isDisabled,
	}: {
		isIndeterminate: boolean;
		isSelected: boolean;
		isDisabled: boolean;
	}) => (
		<>
			<span
				className={css["check-box"]}
				data-state={isDisabled ? "disabled" : isSelected ? "selected" : undefined}
			>
				{isIndeterminate ? (
					<Icon icon={DashIcon} />
				) : isSelected ? (
					<Icon icon={CheckMarkIcon} />
				) : null}
			</span>
			{children != null ? (
				<span className={css["label"]} data-variant={variant}>
					<span className={css["text"]}>{children}</span>
					<RequiredIndicator
						isRequired={props.isRequired}
						necessityIndicator={necessityIndicator}
					/>
				</span>
			) : null}
		</>
	);
	if (description == null && errorMessage == null && validationMessage == null) {
		return (
			<Checkbox
				{...checkboxProps}
				isInvalid={isInvalid}
				validationBehavior={validationBehavior}
				className={css["container"]}
				data-variant={variant}
			>
				{content}
			</Checkbox>
		);
	}
	return (
		<CheckboxField {...checkboxProps} isInvalid={isInvalid} validationBehavior={validationBehavior}>
			<AriaField
				description={description}
				errorMessage={errorMessage ?? validationMessage}
				isDisabled={props.isDisabled}
				validationState={isInvalid ? "invalid" : validationState}
			>
				<CheckboxButton className={css["container"]} data-variant={variant}>
					{content}
				</CheckboxButton>
			</AriaField>
		</CheckboxField>
	);
}
