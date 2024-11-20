import WorkflowPageContent from "@/app/workflow/[persistentId]/workflow-page";
import type { Workflow } from "@/lib/data/sshoc/api/workflow";
import type { WorkflowStep } from "@/lib/data/sshoc/api/workflow-step";
import type { ReactNode } from "react";

export namespace WorkflowPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Workflow["persistentId"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export interface SearchParamsInput extends ParamsInput {
    step?: WorkflowStep["persistentId"];
  }
  export interface Props {
    params: PathParams;
  }
}

export default function WorkflowPage(props: WorkflowPage.Props): ReactNode {
  const { persistentId } = props.params;

  return <WorkflowPageContent persistentId={persistentId} />;
}
