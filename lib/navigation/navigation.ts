/* eslint-disable no-restricted-imports */

import Link from "next/link";
import type { ComponentPropsWithRef, FC } from "react";

export { redirect, usePathname, useRouter, useSearchParams } from "next/navigation";

export type LocaleLinkProps = Omit<ComponentPropsWithRef<typeof Link>, "href"> & {
	href: string | undefined;
};

export const LocaleLink = Link as FC<LocaleLinkProps>;
