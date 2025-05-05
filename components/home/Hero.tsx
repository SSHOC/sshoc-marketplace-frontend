import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Link } from "@/components/common/Link";

export interface HeroProps {
	children?: ReactNode;
}

export function Hero(props: HeroProps): ReactNode {
	const { children } = props;

	const t = useTranslations();

	return (
		<section className="relative grid min-h-[min(62.5vw,688px)] content-start justify-center gap-8 py-32 [grid-area:hero]">
			<h1 className="text-[1.75rem] leading-tight font-bold text-neutral-800">
				{t("common.home.title")}
			</h1>
			<p className="text-md leading-relaxed">
				{t("common.home.lead-in")}{" "}
				<Link aria-label={t("common.home.read-more-about-sshocmp")} href="/about/service">
					{t("common.read-more")}&hellip;
				</Link>
			</p>
			{children}
		</section>
	);
}
