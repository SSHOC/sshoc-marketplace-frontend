import type { PageMetadataProps as NextPageMetadataProps } from "@stefanprobst/next-page-metadata";
import { PageMetadata as NextPageMetadata } from "@stefanprobst/next-page-metadata";
import type { ReactNode } from "react";

import { usePageTitleTemplate } from "@/lib/core/metadata/usePageTitleTemplate";

export type PageMetadataProps = NextPageMetadataProps;

export function PageMetadata(props: PageMetadataProps): ReactNode {
	const titleTemplate = usePageTitleTemplate();

	return <NextPageMetadata titleTemplate={titleTemplate} {...props} />;
}
