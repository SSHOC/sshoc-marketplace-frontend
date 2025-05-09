import { fields } from "@keystatic/core";

import { linkKinds } from "@/lib/content/options";
import type { Paths } from "@/lib/keystatic/paths";
import * as validation from "@/lib/keystatic/validation";

export function createLinkSchema(paths: Paths) {
	return fields.conditional(
		fields.select({
			label: "Kind",
			options: linkKinds,
			defaultValue: "external",
		}),
		{
			"about-pages": fields.object({
				id: fields.relationship({
					label: "About page",
					validation: { isRequired: true },
					collection: "about-pages",
				}),
				search: fields.text({
					label: "Query params",
					validation: { isRequired: false, pattern: validation.urlSearchParamsOptional },
				}),
				hash: fields.text({
					label: "URL fragment",
					validation: { isRequired: false, pattern: validation.urlFragmentOptional },
				}),
			}),
			"contribute-pages": fields.object({
				id: fields.relationship({
					label: "Contribute page",
					validation: { isRequired: true },
					collection: "contribute-pages",
				}),
				search: fields.text({
					label: "Query params",
					validation: { isRequired: false, pattern: validation.urlSearchParamsOptional },
				}),
				hash: fields.text({
					label: "URL fragment",
					validation: { isRequired: false, pattern: validation.urlFragmentOptional },
				}),
			}),
			"contact-page": fields.object({
				search: fields.text({
					label: "Query params",
					validation: { isRequired: false, pattern: validation.urlSearchParamsOptional },
				}),
				hash: fields.text({
					label: "URL fragment",
					validation: { isRequired: false, pattern: validation.urlFragmentOptional },
				}),
			}),
			"current-page": fields.text({
				label: "URL fragment",
				validation: { isRequired: true, pattern: validation.urlFragment },
			}),
			download: fields.file({
				label: "Download",
				validation: { isRequired: true },
				...paths.assets.downloads,
			}),
			email: fields.text({
				label: "Email",
				validation: { isRequired: true, pattern: validation.email },
			}),
			external: fields.url({
				label: "URL",
				validation: { isRequired: true },
			}),
			"search-page": fields.object({
				search: fields.text({
					label: "Query params",
					validation: { isRequired: false, pattern: validation.urlSearchParamsOptional },
				}),
				hash: fields.text({
					label: "URL fragment",
					validation: { isRequired: false, pattern: validation.urlFragmentOptional },
				}),
			}),
		},
	);
}
