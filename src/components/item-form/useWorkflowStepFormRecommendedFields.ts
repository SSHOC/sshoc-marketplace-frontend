import type { WorkflowStepInput } from '@/data/sshoc/api/workflow-step'

const recommendedFields = {
  // label: '',
  // description: '',
  relatedItems: [undefined],
}

const fields = { ...recommendedFields }

export function useWorkflowStepFormRecommendedFields(): Partial<WorkflowStepInput> {
  return fields as unknown as Partial<WorkflowStepInput>
}
