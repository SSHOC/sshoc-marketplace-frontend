import { z } from "zod";

import { itemBaseInputSchema } from "@/lib/data/sshoc/validation-schemas/item";

export const workflowStepInputSchema = itemBaseInputSchema.extend({
  stepNo: z.number().optional(),
});
