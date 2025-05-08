import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Button as AriaButton } from "react-aria-components";

export function CloseButton(): ReactNode {
	const t = useTranslations();

	return (
		<AriaButton
			aria-label={t("common.close")}
			className="grid shrink-0 place-content-center text-neutral-700 hover:text-primary-600 focus-visible:text-primary-600 pressed:text-primary-500"
		>
			<XIcon aria-hidden className="size-5" />
		</AriaButton>
	);
}
