"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { createHref } from "@/lib/navigation/create-href";
import { usePathname } from "@/lib/navigation/navigation";

export function ReportIssueLink(): ReactNode {
	const t = useTranslations("ReportIssueLink");

	const pathname = usePathname();

	return (
		<Link
			className="text-sm text-neutral-600 transition hover:text-neutral-700"
			href={createHref({
				pathname: "/contact",
				searchParams: {
					subject: t("label"),
					message: t("message", { page: pathname }),
				},
			})}
		>
			{t("label")}
		</Link>
	);
}
