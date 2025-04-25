import { useSearchField } from "@react-aria/searchfield";
import { useSearchFieldState } from "@react-stately/searchfield";
import type { AriaSearchFieldProps } from "@react-types/searchfield";
import type { Alignment, LabelPosition, NecessityIndicator } from "@react-types/shared";
import type { ForwardedRef } from "react";
import { forwardRef, useRef } from "react";

import { ClearButton } from "@/lib/core/ui/ClearButton/ClearButton";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import MagnifierIcon from "@/lib/core/ui/icons/magnifier.svg?symbol-icon";
import { TextFieldBase } from "@/lib/core/ui/TextField/TextFieldBase";

export interface SearchFieldProps extends AriaSearchFieldProps {
	icon?: JSX.Element;
	isRequired?: boolean;
	/** @default 'start' */
	labelAlign?: Alignment;
	labelPosition?: LabelPosition;
	/** @default 'icon' */
	necessityIndicator?: NecessityIndicator;
}

export const SearchField = forwardRef(function SearchField(
	props: SearchFieldProps,
	forwardedRef: ForwardedRef<HTMLDivElement>,
): ReactNode {
	const defaultIcon = <Icon icon={MagnifierIcon} />;

	const { icon = defaultIcon, isDisabled, ...otherProps } = props;

	const state = useSearchFieldState(props);
	const inputRef = useRef<HTMLInputElement>(null);
	const { labelProps, inputProps, clearButtonProps, descriptionProps, errorMessageProps } =
		useSearchField(props, state, inputRef);

	const clearButton = <ClearButton {...clearButtonProps} isDisabled={isDisabled} preventFocus />;

	return (
		<TextFieldBase
			ref={forwardedRef}
			{...otherProps}
			descriptionProps={descriptionProps}
			errorMessageProps={errorMessageProps}
			icon={icon}
			inputProps={inputProps}
			inputRef={inputRef}
			isDisabled={isDisabled}
			labelProps={labelProps}
			wrapperChildren={state.value !== "" && props.isReadOnly !== true ? clearButton : undefined}
		/>
	);
});
