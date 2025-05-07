import type { ValueForReading } from "@keystatic/core";
import NextLink from "next/link";
import type { ReactNode } from "react";

import type { createLinkSchema } from "@/lib/keystatic/create-link-schema";

export type LinkSchema = ValueForReading<ReturnType<typeof createLinkSchema>>;

type LinkProps = LinkSchema & {
	children?: ReactNode;
};

export function Link(props: Readonly<LinkProps>): ReactNode {
	const { children, ...rest } = props;

	return <NextLink {...getLinkProps(rest)}>{children}</NextLink>;
}

export function getLinkProps(params: LinkSchema) {
	const { discriminant, value } = params;

	switch (discriminant) {
		case "about-pages": {
			return { href: `/about/${value.id}${value.search}${value.hash}` };
		}

		case "contact-page": {
			return { href: `/contact${value.search}${value.hash}` };
		}

		case "contribute-pages": {
			return { href: `/contribute/${value.id}${value.search}${value.hash}` };
		}

		case "current-page": {
			return { href: value };
		}

		case "download": {
			return { download: true, href: value };
		}

		case "email": {
			return { href: `mailto:${value}` };
		}

		case "external": {
			return { href: value };
		}

		case "search-page": {
			return { href: `/search${value.search}${value.hash}` };
		}
	}
}
