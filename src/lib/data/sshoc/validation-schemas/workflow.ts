import { z } from "zod";

import { itemBaseInputSchema } from "@/lib/data/sshoc/validation-schemas/item";
import { workflowStepInputSchema } from "@/lib/data/sshoc/validation-schemas/workflow-step";

export const workflowInputSchema = itemBaseInputSchema;

export const workflowWithStepsInputSchema = workflowInputSchema.and(
  z.object({ composedOf: z.array(workflowStepInputSchema).optional() })
);
