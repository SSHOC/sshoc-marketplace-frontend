import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ScreenNavigation } from "@/components/common/ScreenNavigation";
import { useContributeNavItems } from "@/lib/core/page/useContributeNavItems";

export function ContributeScreenNavigation(): ReactNode {
	const t = useTranslations();
	const items = useContributeNavItems();

	return <ScreenNavigation label={t("common.pages.contribute")} items={items} />;
}
