"use client";

import { redirect, usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { defaultLocale } from "@/config/i18n.config";

/**
 * This page renders when a route is requested that doesn't match the
 * middleware and therefore doesn't have a locale associated with it.
 */
export default function NotFound(): ReactNode {
	const pathname = usePathname();

	redirect(`/${defaultLocale}${pathname}`);
}
