import { ScreenNavigation } from "@/components/common/ScreenNavigation";
import { useI18n } from "@/lib/core/i18n/useI18n";
import type { NavItems } from "@/lib/core/page/types";

interface ContributeScreenNavigationProps {
  navigationMenu: NavItems;
}

export function ContributeScreenNavigation(
  props: ContributeScreenNavigationProps
): JSX.Element {
  const { t } = useI18n<"common">();
  const items = props.navigationMenu;

  return (
    <ScreenNavigation
      label={t(["common", "pages", "contribute"])}
      items={items}
    />
  );
}
