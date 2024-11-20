import EditWorkflowPageContent from "@/app/workflow/[persistentId]/edit/edit-workflow-page";
import type { Workflow, WorkflowInput } from "@/lib/data/sshoc/api/workflow";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type { ReactNode } from "react";

export type UpdateWorkflowFormValues = ItemFormValues<WorkflowInput>;

export namespace EditWorkflowPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Workflow["persistentId"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function EditWorkflowPage(
  props: EditWorkflowPage.Props
): ReactNode {
  const { persistentId } = props.params;

  return <EditWorkflowPageContent persistentId={persistentId} />;
}
