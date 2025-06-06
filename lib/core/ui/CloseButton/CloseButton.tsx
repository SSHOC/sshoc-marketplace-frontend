import { useButton } from "@react-aria/button";
import type { AriaButtonProps } from "@react-types/button";
import { useTranslations } from "next-intl";
import type { CSSProperties, ForwardedRef, ReactNode } from "react";
import { forwardRef, useRef } from "react";
import useComposedRef from "use-composed-ref";

import css from "@/lib/core/ui/CloseButton/CloseButton.module.css";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import CloseIcon from "@/lib/core/ui/icons/cross.svg?symbol-icon";

export interface CloseButtonStyleProps {
	"--close-button-color"?: CSSProperties["color"];
	"--close-button-color-hover"?: CSSProperties["color"];
	"--close-button-color-focus"?: CSSProperties["color"];
	"--close-button-color-active"?: CSSProperties["color"];
	"--close-button-color-disabled"?: CSSProperties["color"];
}
export interface CloseButtonProps extends AriaButtonProps {
	/** @default 'md' */
	size?: "lg" | "md" | "sm";
	style?: CloseButtonStyleProps;
}

// FIXME: should be <Button variant="ghost" />
export const CloseButton = forwardRef(function CloseButton(
	props: CloseButtonProps,
	forwardedRef: ForwardedRef<HTMLButtonElement>,
): ReactNode {
	const { size = "md", style } = props;

	const t = useTranslations();
	const buttonRef = useRef<HTMLButtonElement>(null);
	const { buttonProps } = useButton(
		{
			...props,
			"aria-label": props["aria-label"] ?? t("common.close"),
		},
		buttonRef,
	);

	const ref = useComposedRef(buttonRef, forwardedRef);

	return (
		<button
			ref={ref}
			type="button"
			{...buttonProps}
			className={css["button"]}
			data-size={size}
			style={style}
		>
			<Icon icon={CloseIcon} />
		</button>
	);
});
