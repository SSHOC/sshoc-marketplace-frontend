import { createUrlSearchParams } from "@stefanprobst/request";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { useCurrentUser } from "@/data/sshoc/hooks/auth";
import { usePathname } from "@/lib/core/navigation/usePathname";
import { AuthButton } from "@/lib/core/page/AuthButton";
import { MobileNavigationMenu, PageNavigation } from "@/lib/core/page/PageNavigation";
import Logo from "@/public/assets/images/logo-with-text.svg";

export function PageHeader(): ReactNode {
	const t = useTranslations();
	const pathname = usePathname();
	const currentUser = useCurrentUser();

	return (
		<header className="border-b border-neutral-150 [grid-area:page-header]">
			<div className="mx-auto flex w-full max-w-[120rem] gap-x-8 px-8">
				<Link href="/" className="my-4 flex w-52 shrink-0 items-center rounded-sm">
					<span className="sr-only">{t("common.pages.home")}</span>
					<Image src={Logo} alt="" priority />
				</Link>
				<div className="hidden flex-1 flex-col items-end gap-y-2 xl:flex">
					<div className="flex gap-x-8">
						<Link
							className="flex items-center rounded-b-sm px-2 text-sm text-neutral-600 transition hover:text-neutral-700 focus-visible:text-neutral-700"
							href={`/contact?${createUrlSearchParams({
								email: currentUser.data?.email,
								subject: t("common.report-issue"),
								message: t("common.report-issue-message", { pathname }),
							})}`}
						>
							{t("common.report-issue")}
						</Link>
						<AuthButton />
					</div>
					<PageNavigation />
				</div>
				<div className="flex flex-1 items-center justify-end xl:hidden">
					<MobileNavigationMenu />
				</div>
			</div>
		</header>
	);
}
