"use client";

import { Link } from "@/components/link";
import { createHref } from "@/lib/navigation/create-href";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

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
