import Image from "next/legacy/image";
import type { ReactNode } from "react";

import css from "@/components/common/FundingNotice.module.css";
import { useI18n } from "@/lib/core/i18n/useI18n";
import CessdaLogo from "~/public/assets/cms/images/cessda-logo.png";
import ClarinLogo from "~/public/assets/cms/images/clarin-logo.png";
import DariahEuLogo from "~/public/assets/cms/images/dariah-eu-logo.png";
import EUFlag from "~/public/assets/images/eu-flag.svg";

export function FundingNotice(): ReactNode {
	const { t } = useI18n<"common">();

	return (
		<section className={css["container"]}>
			<Image src={EUFlag} alt={t(["common", "eu-flag"])} />
			<p>{t(["common", "funding-notice"])}</p>
			<div className={css["logos"]}>
				<Image src={CessdaLogo} alt={t(["common", "cessda"])} objectFit="contain" />
				<Image src={ClarinLogo} alt={t(["common", "clarin"])} objectFit="contain" />
				<Image src={DariahEuLogo} alt={t(["common", "dariah-eu"])} objectFit="contain" />
			</div>
		</section>
	);
}
