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
		<section className="border-t border-neutral-150">
			<div className="flex max-w-[42rem] flex-col gap-6 px-6 py-24">
				<div className="flex items-start gap-x-6">
					<h2 className="sr-only">{t("title")}</h2>

					<Image alt="" className="mt-1 w-10 shrink-0" src={eu} />

					<p className="text-xs leading-[1.75] text-neutral-600">{t("message")}</p>
				</div>

				<div className="flex items-center gap-x-2">
					<Image alt="" className="w-20 shrink-0" src={cessda} />
					<Image alt="" className="w-20 shrink-0" src={clarin} />
					<Image alt="" className="w-20 shrink-0" src={dariah} />
				</div>
			</div>
		</section>
	);
}
