import dynamic from "next/dynamic";
import { Fragment, memo, type ReactNode } from "react";

import { AboutScreenLayout } from "@/components/about/AboutScreenLayout";
import { ContributeScreenLayout } from "@/components/contribute/ContributeScreenLayout";
import { config } from "@/lib/cms/cms.config";
import type { PageComponent } from "@/lib/core/app/types";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";

const Cms = dynamic(
	async () => {
		const { default: Cms } = await import("netlify-cms-app");
		const { default: withResourceLinks } = await import("@stefanprobst/remark-resource-links");

		Cms.registerPreviewStyle("/assets/cms/styles/index.css");

		Cms.registerPreviewTemplate("about-pages", memo(AboutScreenLayout));
		Cms.registerPreviewTemplate("contribute-pages", memo(ContributeScreenLayout));

		/**
		 * Register plugins to the richtext editor widget to (i) avoid saving
		 * autolinks, and (ii) enforce serialisation that is closer to `prettier`'s
		 * format.
		 */
		Cms.registerRemarkPlugin(withResourceLinks);
		Cms.registerRemarkPlugin({
			settings: {
				bullet: "-",
				emphasis: "_",
			},
			plugins: [],
		});

		Cms.init({ config });

		return Fragment;
	},
	{
		ssr: false,
		loading: function Loading(props) {
			const { error, pastDelay, retry, timedOut } = props;

			const message =
				error != null ? (
					<div>
						Failed to load CMS!{" "}
						<button onClick={retry} type="button">
							Retry
						</button>
					</div>
				) : timedOut === true ? (
					<div>
						Taking a long time to load CMS&hellip;{" "}
						<button onClick={retry} type="button">
							Retry
						</button>
					</div>
				) : pastDelay === true ? (
					<div>Loading CMS&hellip;</div>
				) : null;

			return <FullPage>{message}</FullPage>;
		},
	},
);

export namespace AdminPage {
	export type PathParamsInput = Record<string, never>;
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export type Props = Record<string, never>;
}

export default function AdminPage(_props: AdminPage.Props): ReactNode {
	return (
		<Fragment>
			<PageMetadata nofollow noindex title="CMS" openGraph={{}} twitter={{}} />
			<div id="nc-root" />
			<Cms />
		</Fragment>
	);
}

const Page: PageComponent<AdminPage.Props> = AdminPage;

Page.getLayout = (page) => {
	return page;
};

// @refresh reset
