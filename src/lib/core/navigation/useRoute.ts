import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { createSiteUrl } from "@/lib/utils";

export function useRoute(): URL {
  const pathname = usePathname() ?? "";

  const route = useMemo(() => {
    return createSiteUrl({ pathname });
  }, [pathname]);

  return route;
}
