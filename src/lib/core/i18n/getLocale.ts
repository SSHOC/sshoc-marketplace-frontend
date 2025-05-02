import type { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import type { NextRouter } from "next/router";

import type { Locale } from "~/config/i18n.config";

export function getLocale(
	context: GetServerSidePropsContext | GetStaticPropsContext | NextRouter,
): Locale {
	return context.locale as Locale;
}
