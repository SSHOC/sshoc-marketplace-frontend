import { isoDateString } from "@/lib/data/sshoc/validation-schemas/common";
import { itemBaseInputSchema } from "@/lib/data/sshoc/validation-schemas/item";

export const trainingMaterialInputSchema = itemBaseInputSchema.extend({
  dateCreated: isoDateString.optional(),
  dateLastUpdated: isoDateString.optional(),
});
