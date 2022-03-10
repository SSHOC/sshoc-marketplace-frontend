import { useState } from 'react'

export type WorkflowFormPage =
  | { type: 'step'; index: number; onReset: () => void }
  | { type: 'steps' }
  | { type: 'workflow' }

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useWorkflowFormPage() {
  const [page, setPage] = useState<WorkflowFormPage>({ type: 'workflow' })

  return { page, setPage }
}
