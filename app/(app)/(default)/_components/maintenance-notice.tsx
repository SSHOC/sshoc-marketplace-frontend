import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ServerImage as Image } from "@/components/server-image";
import cessda from "@/public/assets/content/images/cessda-logo.png";
import clarin from "@/public/assets/content/images/clarin-logo.png";
import dariah from "@/public/assets/content/images/dariah-eu-logo.png";
import eu from "@/public/assets/images/eu-flag.svg";

export function MaintenanceNotice(): ReactNode {
	const t = useTranslations("MaintenanceNotice");

	return (
		<section className="max-w-[64rem] gap-6 border-t border-neutral-150 py-24">
			<h2 className="sr-only">{t("title")}</h2>

			<Image alt="" className="w-10" src={eu} />

			<p className="text-xs leading-[1.75] text-neutral-600">{t("message")}</p>

			<div className="flex gap-x-2">
				<Image alt="" className="w-20" src={cessda} />
				<Image alt="" className="w-20" src={clarin} />
				<Image alt="" className="w-20" src={dariah} />
			</div>
		</section>
	);
}
