import WorkflowHistoryPageContent from "@/app/workflow/[persistentId]/history/workflow-history-page";
import type { Workflow } from "@/lib/data/sshoc/api/workflow";
import type { ReactNode } from "react";

export namespace WorkflowHistoryPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Workflow["persistentId"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function WorkflowHistoryPage(
  props: WorkflowHistoryPage.Props
): ReactNode {
  const { persistentId } = props.params;

  return <WorkflowHistoryPageContent persistentId={persistentId} />;
}
