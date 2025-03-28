"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ButtonNavLink } from "@/components/ui/button";
import { createHref } from "@/lib/navigation/create-href";

export function AuthMenu(): ReactNode {
	const t = useTranslations("AuthMenu");

	return (
		<ButtonNavLink
			className="min-w-40 rounded-t-none"
			href={createHref({ pathname: "/auth/sign-in" })}
			size="small"
		>
			{t("sign-in")}
		</ButtonNavLink>
	);
}
