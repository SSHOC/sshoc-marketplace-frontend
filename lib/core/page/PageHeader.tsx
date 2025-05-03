import { createUrlSearchParams } from "@stefanprobst/request";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { NavLink } from "@/components/common/NavLink";
import { useCurrentUser } from "@/data/sshoc/hooks/auth";
import { usePathname } from "@/lib/core/navigation/usePathname";
import { AuthButton } from "@/lib/core/page/AuthButton";
import { MobileNavigationMenu } from "@/lib/core/page/MobileNavigationMenu";
import css from "@/lib/core/page/PageHeader.module.css";
import { PageNavigation } from "@/lib/core/page/PageNavigation";
import Logo from "@/public/assets/images/logo-with-text.svg";

export function PageHeader(): ReactNode {
	const t = useTranslations();
	const pathname = usePathname();
	const currentUser = useCurrentUser();

	return (
		<header className={css["container"]}>
			<div className={css["home-link"]}>
				<NavLink href="/" aria-label={t("common.pages.home")}>
					<Image src={Logo} alt="" priority />
				</NavLink>
			</div>
			<div className={css["secondary-nav"]}>
				<div className={css["secondary-nav-link"]}>
					<NavLink
						href={`/contact?${createUrlSearchParams({
							email: currentUser.data?.email,
							subject: t("common.report-issue"),
							message: t("common.report-issue-message", { pathname }),
						})}`}
					>
						{t("common.report-issue")}
					</NavLink>
				</div>
				<AuthButton />
			</div>
			<PageNavigation />
			<MobileNavigationMenu />
		</header>
	);
}
