import type { NecessityIndicator } from "@react-types/shared";
import type { ReactNode } from "react";

import { useI18n } from "@/lib/core/i18n/useI18n";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import AsteriskIcon from "@/lib/core/ui/icons/asterisk.svg?symbol-icon";

export interface RequiredIndicatorProps {
	isRequired?: boolean;
	/** @default "icon" */
	necessityIndicator?: NecessityIndicator;
	includeNecessityIndicatorInAccessibilityName?: boolean;
}

export function RequiredIndicator(props: RequiredIndicatorProps): ReactNode {
	const {
		isRequired = false,
		necessityIndicator = isRequired ? "icon" : null,
		includeNecessityIndicatorInAccessibilityName = false,
	} = props;

	const { t } = useI18n<"common">();

	if (necessityIndicator === "label") {
		const necessityLabel = isRequired
			? t(["common", "ui", "label", "(required)"])
			: t(["common", "ui", "label", "(optional)"]);

		/**
		 * When the field is required, `aria-required` is already set, so the
		 * label should not be exposed to screen readers, but for optional
		 * fields it should be exposed.
		 */
		return <span aria-hidden={isRequired || undefined}>{necessityLabel}</span>;
	}

	/** necessityIndicator === 'icon' */
	if (isRequired) {
		return (
			<Icon
				aria-label={
					includeNecessityIndicatorInAccessibilityName
						? t(["common", "ui", "label", "(required)"])
						: undefined
				}
				icon={AsteriskIcon}
				width="0.35em"
				/* @ts-expect-error Intentional. */
				style={{ transform: "translateY(-0.2em)" }}
			/>
		);
	}

	return null;
}
