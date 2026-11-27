import css from "@/lib/core/ui/TextField/TextFieldBase.module.css";

import type { ValidationState } from "@react-types/shared";
import type { CSSProperties, ReactNode } from "react";

import { Icon } from "@/lib/core/ui/Icon/Icon";
import AlertIcon from "@/lib/core/ui/icons/alert";
import CheckmarkIcon from "@/lib/core/ui/icons/checkmark";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";

export interface TextFieldBaseStyleProps {
	"--textfield-input-background-color"?: CSSProperties["backgroundColor"];
	"--textfield-input-background-color-focus"?: CSSProperties["backgroundColor"];
	"--textfield-input-background-color-hover"?: CSSProperties["backgroundColor"];
	"--textfield-input-background-color-disabled"?: CSSProperties["backgroundColor"];
	"--textfield-input-border-color"?: CSSProperties["borderColor"];
	"--textfield-input-border-color-focus"?: CSSProperties["borderColor"];
	"--textfield-input-border-color-hover"?: CSSProperties["borderColor"];
	"--textfield-input-border-color-disabled"?: CSSProperties["borderColor"];
	"--textfield-input-border-width"?: CSSProperties["borderWidth"];
	"--textfield-input-border-radius"?: CSSProperties["borderRadius"];
	"--textfield-input-color"?: CSSProperties["color"];
	"--textfield-input-color-focus"?: CSSProperties["color"];
	"--textfield-input-color-hover"?: CSSProperties["color"];
	"--textfield-input-color-disabled"?: CSSProperties["color"];
	"--textfield-input-placeholder-color"?: CSSProperties["color"];
	"--textfield-input-placeholder-color-focus"?: CSSProperties["color"];
	"--textfield-input-placeholder-color-hover"?: CSSProperties["color"];
	"--textfield-input-placeholder-color-disabled"?: CSSProperties["color"];
	"--textfield-input-padding-block"?: CSSProperties["paddingBlock"];
	"--textfield-input-padding-inline"?: CSSProperties["paddingInline"];
	"--textfield-input-font-size"?: CSSProperties["fontSize"];
	"--textfield-input-line-height"?: CSSProperties["lineHeight"];
	"--textfield-icon-color"?: CSSProperties["color"];
	"--textfield-validation-icon-color"?: CSSProperties["color"];
}

interface TextFieldControlProps {
	children: ReactNode;
	color?:
		| "form"
		| "primary"
		| "review changed"
		| "review deleted"
		| "review inserted"
		| "review unchanged";
	icon?: ReactNode;
	isLoading?: boolean;
	loadingIndicator?: ReactNode;
	size?: "lg" | "md" | "sm";
	style?: TextFieldBaseStyleProps;
	validationState?: ValidationState;
	wrapperChildren?: ReactNode;
}

export function TextFieldControl({
	children,
	color = "primary",
	icon,
	isLoading,
	loadingIndicator = <ProgressSpinner size="sm" />,
	size = "md",
	style,
	validationState,
	wrapperChildren,
}: TextFieldControlProps): ReactNode {
	const isInvalid = validationState === "invalid";
	return (
		<div
			className={css["textfield"]}
			data-color={color}
			data-icon={[icon != null ? "left" : undefined, wrapperChildren != null ? "right" : undefined]
				.filter(Boolean)
				.join(" ")}
			data-loading-state={isLoading === true ? "loading" : undefined}
			data-size={size}
			data-validation-state={validationState}
			style={style as CSSProperties}
		>
			{children}
			{icon != null ? <div className={css["icon-left"]}>{icon}</div> : null}
			{isLoading === true ? (
				<div className={css["validation-icon"]}>{loadingIndicator}</div>
			) : validationState ? (
				<div className={css["validation-icon"]}>
					<Icon icon={isInvalid ? AlertIcon : CheckmarkIcon} />
				</div>
			) : null}
			{wrapperChildren != null ? <div className={css["icon-right"]}>{wrapperChildren}</div> : null}
		</div>
	);
}
