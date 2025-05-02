import { z } from "zod";

import { actorRefSchema, actorRoleRefSchema } from "@/data/sshoc/validation-schemas/actor";
import { mediaDetailsRefSchema } from "@/data/sshoc/validation-schemas/media";
import { propertyInputSchema } from "@/data/sshoc/validation-schemas/property";
import { sourceRefSchema } from "@/data/sshoc/validation-schemas/source";
import { conceptRefSchema } from "@/data/sshoc/validation-schemas/vocabulary";

export const itemContributorRefSchema = z.object({
	actor: actorRefSchema,
	role: actorRoleRefSchema,
});

export const itemSourceRefSchema = z.object({
	code: z.string(),
});

export const itemExternalIdInputSchema = z.object({
	identifier: z.string().min(1),
	identifierService: itemSourceRefSchema,
});

export const itemRelationRefSchema = z.object({
	code: z.string(),
});

export const relatedItemInputSchema = z.object({
	persistentId: z.string(),
	relation: itemRelationRefSchema,
});

export const itemMediaInputSchema = z.object({
	info: mediaDetailsRefSchema,
	caption: z.string().optional(),
	concept: conceptRefSchema.optional(),
});

export const itemBaseInputSchema = z.object({
	label: z.string().min(1),
	version: z.string().optional(),
	description: z.string().min(1),
	contributors: z.array(itemContributorRefSchema).optional(),
	properties: z.array(propertyInputSchema).optional(),
	externalIds: z.array(itemExternalIdInputSchema).optional(),
	accessibleAt: z.array(z.string().url()).optional(),
	source: sourceRefSchema.optional(),
	sourceItemId: z.string().optional(),
	relatedItems: z.array(relatedItemInputSchema).optional(),
	media: z.array(itemMediaInputSchema).optional(),
	thumbnail: itemMediaInputSchema.optional(),
});
// .refine((data) => {
//   if (data.source == null && data.sourceItemId != null) {
//     return false
//   }
//   if (data.source != null && data.sourceItemId == null) {
//     return false
//   }
//   return true
// })

export const itemSourceInputSchema = z
	.object({
		label: z.string().min(1),
		ord: z.number().optional(),
		urlTemplate: z.string().url().optional(),
	})
	.refine(
		(data) => {
			if (`urlTemplate` in data && data.urlTemplate != null) {
				if (!data.urlTemplate.includes("{source-item-id}")) {
					return false;
				}
			}
			return true;
		},
		{
			message: 'Must include "{source-item-id}"',
			path: ["urlTemplate"],
			params: { code: "missingSourceItemId" },
		},
	);

export const itemCommentInputSchema = z.object({
	body: z.string().min(1),
});

export const itemRelationKindInputSchema = z.object({
	label: z.string().min(1),
	inverseOf: z.string().optional(),
	ord: z.number().optional(),
});

export const itemRelationInputSchema = z.object({
	code: z.string(),
});
