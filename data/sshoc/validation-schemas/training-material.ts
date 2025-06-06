import { isoDateString } from "@/data/sshoc/validation-schemas/common";
import { itemBaseInputSchema } from "@/data/sshoc/validation-schemas/item";

export const trainingMaterialInputSchema = itemBaseInputSchema.extend({
	dateCreated: isoDateString.optional(),
	dateLastUpdated: isoDateString.optional(),
});
