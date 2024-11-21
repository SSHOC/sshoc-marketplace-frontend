import type { ValueForReading } from "@keystatic/core";

import type { createLinkSchema } from "@/lib/keystatic/create-link-schema";

export type LinkSchema = ValueForReading<ReturnType<typeof createLinkSchema>>;

export function getLinkProps(params: LinkSchema) {
	switch (params.discriminant) {
		case "about-pages": {
			return { href: `/about/${params.value}` };
		}

		case "contribute-pages": {
			return { href: `/contribute/${params.value}` };
		}

		case "pages": {
			return { href: `/${params.value}` };
		}

		case "download": {
			return { download: true, href: params.value };
		}

		case "external": {
			return { href: params.value };
		}
	}
}
