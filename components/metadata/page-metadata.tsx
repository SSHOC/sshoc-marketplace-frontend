import Head from "next/head";
import { Fragment, type ReactNode } from "react";

import metadata from "@/content/metadata/index.json";

interface PageMetadataProps {
	title: string;
	description?: string;
	noindex?: boolean;
}

export function PageMetadata(props: Readonly<PageMetadataProps>): ReactNode {
	const { title, description, noindex } = props;

	const pageTitle = [title, metadata.title].join(" | ");

	return (
		<Head>
			<title>{pageTitle}</title>
			<meta property="og:title" content={pageTitle} />

			{description ? (
				<Fragment>
					<meta name="description" content={description} />
					<meta property="og:description" content={metadata.description} />
				</Fragment>
			) : null}

			{noindex ? <meta name="robots" content="noindex" /> : null}
		</Head>
	);
}
