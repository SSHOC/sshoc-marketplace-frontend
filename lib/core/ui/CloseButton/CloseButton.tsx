import css from "@/lib/core/ui/CloseButton/CloseButton.module.css";

import { useTranslations } from "next-intl";
import type { CSSProperties, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";

import { Icon } from "@/lib/core/ui/Icon/Icon";
import CloseIcon from "@/lib/core/ui/icons/cross";

export interface CloseButtonStyleProps {
	"--close-button-color"?: CSSProperties["color"];
	"--close-button-color-hover"?: CSSProperties["color"];
	"--close-button-color-focus"?: CSSProperties["color"];
	"--close-button-color-active"?: CSSProperties["color"];
	"--close-button-color-disabled"?: CSSProperties["color"];
}
export interface CloseButtonProps extends Omit<
	AriaButtonProps,
	"className" | "style" | "children"
> {
	/** @default 'md' */
	size?: "lg" | "md" | "sm";
	style?: CSSProperties & CloseButtonStyleProps;
}

// FIXME: should be <Button variant="ghost" />
export const CloseButton = forwardRef(function CloseButton(
	props: CloseButtonProps,
	ref: ForwardedRef<HTMLButtonElement>,
): ReactNode {
	const t = useTranslations();
	const {
		"aria-label": ariaLabel = t("common.close"),
		size = "md",
		slot = null,
		...buttonProps
	} = props;

	return (
		<AriaButton
			{...buttonProps}
			ref={ref}
			slot={slot}
			aria-label={ariaLabel}
			className={css["button"]}
			data-size={size}
		>
			<Icon icon={CloseIcon} />
		</AriaButton>
	);
});
