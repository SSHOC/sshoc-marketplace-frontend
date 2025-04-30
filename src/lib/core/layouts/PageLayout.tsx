import type { ReactNode } from "react";

import type { SharedPageProps } from "@/lib/core/app/types";
import { useI18n } from "@/lib/core/i18n/useI18n";
import css from "@/lib/core/layouts/PageLayout.module.css";
import { AuthHeader } from "@/lib/core/page/AuthHeader";
import { PageFooter } from "@/lib/core/page/PageFooter";
import { PageHeader } from "@/lib/core/page/PageHeader";
// import { PageLoadingIndicator } from '@/lib/core/page/PageLoadingIndicator'
import { SkipLink } from "@/lib/core/page/SkipLink";

export interface PageLayoutProps {
	children?: ReactNode;
	pageProps: SharedPageProps;
}

export function PageLayout(props: PageLayoutProps): ReactNode {
	const { t } = useI18n<"common">();

	return (
		<div className={css["page-layout"]}>
			<SkipLink>{t(["common", "skip-to-main-content"])}</SkipLink>
			{/* <PageLoadingIndicator /> */}
			<PageHeader />
			<AuthHeader />
			{props.children}
			<PageFooter />
		</div>
	);
}
