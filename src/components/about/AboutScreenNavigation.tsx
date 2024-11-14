import { ScreenNavigation } from "@/components/common/ScreenNavigation";
import { useI18n } from "@/lib/core/i18n/useI18n";
import type { NavItems } from "@/lib/core/page/types";

interface AboutScreenNavigationProps {
  navigationMenu: NavItems;
}

export function AboutScreenNavigation(
  props: AboutScreenNavigationProps
): JSX.Element {
  const { t } = useI18n<"common">();
  const items = props.navigationMenu;

  return (
    <ScreenNavigation label={t(["common", "pages", "about"])} items={items} />
  );
}
