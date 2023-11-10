import { notFound } from "next/navigation";
import { useLocale as _useLocale } from "next-intl";
import { createSharedPathnamesNavigation } from "next-intl/navigation";
import type { ComponentPropsWithoutRef } from "react";

import { isValidLocale, type Locale, locales } from "@/config/i18n.config";

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
	locales,
});

type _LinkProps = ComponentPropsWithoutRef<typeof Link>;

type Href = Exclude<_LinkProps["href"], string>;

export type LinkProps = Omit<_LinkProps, "href"> & {
	href: Href;
};

export function useLocale(): Locale {
	const locale = _useLocale();

	if (!isValidLocale(locale)) notFound();

	return locale;
}
