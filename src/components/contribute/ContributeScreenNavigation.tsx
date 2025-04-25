import type { ReactNode } from "react";

import { ScreenNavigation } from "@/components/common/ScreenNavigation";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { useContributeNavItems } from "@/lib/core/page/useContributeNavItems";

export function ContributeScreenNavigation(): ReactNode {
	const { t } = useI18n<"common">();
	const items = useContributeNavItems();

	return <ScreenNavigation label={t(["common", "pages", "contribute"])} items={items} />;
}
