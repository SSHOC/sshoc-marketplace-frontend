import { useProgressBar } from "@react-aria/progress";
import type { AriaLabelingProps, DOMProps } from "@react-types/shared";
import type { CSSProperties, ForwardedRef } from "react";
import { forwardRef } from "react";

import { useI18n } from "@/lib/core/i18n/useI18n";
import css from "@/lib/core/ui/ProgressSpinner/ProgressSpinner.module.css";

export interface ProgressSpinnerStyleProps {
	"--progress-spinner-color"?: CSSProperties["color"];
}

export interface ProgressSpinnerProps extends DOMProps, AriaLabelingProps {
	/** @default 'md' */
	size?: "lg" | "md" | "sm";
	style?: ProgressSpinnerStyleProps;
}

export const ProgressSpinner = forwardRef(function ProgressSpinner(
	props: ProgressSpinnerProps,
	forwardedRef: ForwardedRef<HTMLDivElement>,
): ReactNode {
	const { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, size = "md", style } = props;

	const { t } = useI18n<"common">();

	const { progressBarProps } = useProgressBar({
		...props,
		isIndeterminate: true,
		"aria-label":
			ariaLabel == null && ariaLabelledby == null
				? t(["common", "default-spinner-message"])
				: ariaLabel,
	});

	function getRadius() {
		switch (size) {
			case "sm":
				return 20;
			case "md":
				return 36;
			case "lg":
				return 52;
		}
	}

	const radius = getRadius();
	const center = radius / 2;
	const strokeWidth = 2;
	const r = center - strokeWidth;
	const c = 2 * r * Math.PI;
	const offset = c - (1 / 4) * c;

	return (
		<div
			ref={forwardedRef}
			{...progressBarProps}
			className={css["container"]}
			style={style as CSSProperties}
		>
			<svg
				fill="none"
				height={radius}
				role="presentation"
				strokeWidth={strokeWidth}
				viewBox={`0 0 ${radius} ${radius}`}
				width={radius}
			>
				<circle
					cx={center}
					cy={center}
					opacity={0.25}
					r={r}
					role="presentation"
					stroke="currentColor"
				/>
				<circle
					cx={center}
					cy={center}
					r={r}
					role="presentation"
					stroke="currentColor"
					strokeDasharray={c}
					strokeDashoffset={offset}
				>
					<animateTransform
						attributeName="transform"
						begin="0s"
						dur="1s"
						from={`0 ${center} ${center}`}
						repeatCount="indefinite"
						to={`360 ${center} ${center}`}
						type="rotate"
					/>
				</circle>
			</svg>
		</div>
	);
});
