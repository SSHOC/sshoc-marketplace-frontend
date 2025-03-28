"use client";

import { Link } from "@/components/link";
import { createHref } from "@/lib/navigation/create-href";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export function AuthMenu(): ReactNode {
	const t = useTranslations("AuthMenu");

	return <Link href={createHref({ pathname: "/auth/sign-in" })}>{t("sign-in")}</Link>;
}
