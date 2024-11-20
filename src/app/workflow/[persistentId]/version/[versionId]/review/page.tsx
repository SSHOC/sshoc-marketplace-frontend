import ReviewWorkflowPageContent from "@/app/workflow/[persistentId]/version/[versionId]/review/review-workflow-version-page";
import type { Workflow, WorkflowInput } from "@/lib/data/sshoc/api/workflow";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type { ReactNode } from "react";

export type UpdateWorkflowFormValues = ItemFormValues<WorkflowInput>;

export namespace ReviewWorkflowPage {
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

export default function ReviewWorkflowPage(
  props: ReviewWorkflowPage.Props
): ReactNode {
  const { persistentId, versionId } = props.params;

  return (
    <ReviewWorkflowPageContent
      persistentId={persistentId}
      versionId={Number(versionId)}
    />
  );
}
