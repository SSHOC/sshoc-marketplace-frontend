import { useState } from "react";

export type WorkflowFormPage =
	| { type: "step"; index: number; onReset: () => void }
	| { type: "steps" }
	| { type: "workflow" };

export function useWorkflowFormPage() {
	const [page, setPage] = useState<WorkflowFormPage>({ type: "workflow" });

	return { page, setPage };
}
