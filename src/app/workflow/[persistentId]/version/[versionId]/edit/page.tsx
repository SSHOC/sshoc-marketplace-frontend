import EditWorkflowVersionPageContent from "@/app/workflow/[persistentId]/version/[versionId]/edit/edit-workflow-version-page";
import type { Workflow, WorkflowInput } from "@/lib/data/sshoc/api/workflow";
import type { ItemFormValues } from "@/components/item-form/ItemForm";

import type { ReactNode } from "react";

export type UpdateWorkflowFormValues = ItemFormValues<WorkflowInput>;

export namespace EditWorkflowVersionPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Workflow["persistentId"];
    versionId: Workflow["id"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function EditWorkflowVersionPage(
  props: EditWorkflowVersionPage.Props
): ReactNode {
  const { persistentId, versionId } = props.params;

  return (
    <EditWorkflowVersionPageContent
      persistentId={persistentId}
      versionId={Number(versionId)}
    />
  );
}
