import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Button as AriaButton } from "react-aria-components";

export function ClearButton(): ReactNode {
	const t = useTranslations();

	return (
		<AriaButton
			aria-label={t("common.ui.clear")}
			className="grid shrink-0 place-content-center text-neutral-700"
		>
			<XIcon aria-hidden />
		</AriaButton>
	);
}
