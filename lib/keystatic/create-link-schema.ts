import { createAssetOptions, type Paths } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";

import { linkKinds } from "@/lib/content/options";
import * as validation from "@/lib/keystatic/validation";

export function createLinkSchema<TPath extends `/${string}/`>(
	downloadPath: Paths<TPath>["downloadPath"],
) {
	return fields.conditional(
		fields.select({
			label: "Kind",
			options: linkKinds,
			defaultValue: "external",
		}),
		{
			"about-pages": fields.relationship({
				label: "About pages",
				validation: { isRequired: true },
				collection: "about-pages",
			}),
			"contribute-pages": fields.relationship({
				label: "Contribute pages",
				validation: { isRequired: true },
				collection: "contribute-pages",
			}),
			"contact-page": fields.relationship({
				label: "Contact page",
				validation: { isRequired: true },
				collection: "contact-page",
			}),
			download: fields.file({
				label: "Download",
				validation: { isRequired: true },
				...createAssetOptions(downloadPath),
			}),
			email: fields.text({
				label: "Email",
				validation: { isRequired: true, pattern: validation.email },
			}),
			external: fields.url({
				label: "URL",
				validation: { isRequired: true },
			}),
			"url-fragment-id": fields.text({
				label: "Identifier",
				validation: { isRequired: true, pattern: validation.urlFragment },
			}),
		},
	);
}
