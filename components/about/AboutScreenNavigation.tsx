import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ScreenNavigation } from "@/components/common/ScreenNavigation";
import { useAboutNavItems } from "@/lib/core/page/useAboutNavItems";

export function AboutScreenNavigation(): ReactNode {
	const t = useTranslations();
	const items = useAboutNavItems();

	return <ScreenNavigation label={t("common.pages.about")} items={items} />;
}
