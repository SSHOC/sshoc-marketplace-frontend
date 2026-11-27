import css from "@/lib/core/ui/ClearButton/ClearButton.module.css";

import { useTranslations } from "next-intl";
import type { CSSProperties, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";

import { Icon } from "@/lib/core/ui/Icon/Icon";
import CrossIcon from "@/lib/core/ui/icons/cross";

export interface ClearButtonStyleProps {
	"--clear-button-width"?: CSSProperties["width"];
	"--clear-button-height"?: CSSProperties["height"];
	"--clear-button-color"?: CSSProperties["color"];
}

export interface ClearButtonProps extends Omit<AriaButtonProps, "className" | "style"> {
	preventFocus?: boolean;
	style?: ClearButtonStyleProps;
}

export const ClearButton = forwardRef(function ClearButton(
	props: ClearButtonProps,
	ref: ForwardedRef<HTMLButtonElement>,
): ReactNode {
	const t = useTranslations();
	const {
		"aria-label": ariaLabel = t("common.ui.clear"),
		children = <Icon icon={CrossIcon} width="0.5em" />,
		preventFocus = false,
		slot = null,
		style,
		...buttonProps
	} = props;

	return (
		<AriaButton
			{...buttonProps}
			ref={ref}
			slot={slot}
			aria-label={ariaLabel}
			excludeFromTabOrder={preventFocus || buttonProps.excludeFromTabOrder}
			preventFocusOnPress={preventFocus || buttonProps.preventFocusOnPress}
			className={css["clear-button"]}
			style={style as CSSProperties}
		>
			{children}
		</AriaButton>
	);
});
