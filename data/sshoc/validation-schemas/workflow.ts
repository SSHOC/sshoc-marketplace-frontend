import { z } from "zod";

import { itemBaseInputSchema } from "@/data/sshoc/validation-schemas/item";
import { workflowStepInputSchema } from "@/data/sshoc/validation-schemas/workflow-step";

export const workflowInputSchema = itemBaseInputSchema;

export const workflowWithStepsInputSchema = workflowInputSchema.and(
	z.object({ composedOf: z.array(workflowStepInputSchema).optional() }),
);
