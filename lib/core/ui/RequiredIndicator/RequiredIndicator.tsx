import type { ReactNode } from "react";

import { Icon } from "@/lib/core/ui/Icon/Icon";
import AsteriskIcon from "@/lib/core/ui/icons/asterisk.svg?symbol-icon";

export function RequiredIndicator(): ReactNode {
	return (
		<Icon
			// aria-label={t("common.ui.label.(required)")}
			icon={AsteriskIcon}
			width="0.35em"
			/* @ts-expect-error Intentional. */
			style={{ transform: "translateY(-0.2em)" }}
		/>
	);
}
