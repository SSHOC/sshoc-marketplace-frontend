import { dictionary as authenticated } from "@/dictionaries/authenticated/en";
import { dictionary as common } from "@/dictionaries/common/en";
import { createI18nService } from "@stefanprobst/next-i18n";
import { defaultLocale } from "~/config/i18n.config.mjs";

export function createI18n() {
  return createI18nService(defaultLocale, {
    authenticated,
    common,
  });
}
