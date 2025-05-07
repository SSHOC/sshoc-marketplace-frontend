import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import CessdaLogo from "@/public/assets/images/logo-cessda.png";
import ClarinLogo from "@/public/assets/images/logo-clarin.png";
import DariahEuLogo from "@/public/assets/images/logo-dariah-eu.png";
import EUFlag from "@/public/assets/images/logo-eu.svg";

export function FundingNotice(): ReactNode {
	const t = useTranslations();

	return (
		<section className="flex flex-col gap-y-6 py-24 [grid-area:funding-notice] before:absolute before:inset-x-0 before:top-0 before:[grid-row:funding-notice] before:border-t before:border-neutral-150">
			<div className="flex gap-x-6">
				<Image src={EUFlag} alt={t("common.eu-flag")} className="w-10 shrink-0 object-contain" />
				<p className="max-w-176 text-xs leading-relaxed text-neutral-600">
					{t("common.funding-notice")}
				</p>
			</div>
			<div className="flex gap-x-2">
				<Image src={CessdaLogo} alt={t("common.cessda")} className="max-w-30 object-contain" />
				<Image src={ClarinLogo} alt={t("common.clarin")} className="max-w-30 object-contain" />
				<Image src={DariahEuLogo} alt={t("common.dariah-eu")} className="max-w-30 object-contain" />
			</div>
		</section>
	);
}
