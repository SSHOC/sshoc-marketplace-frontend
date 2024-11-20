import WorkflowVersionPageContent from "@/app/workflow/[persistentId]/version/[versionId]/workflow-version-page";
import type { Workflow } from "@/lib/data/sshoc/api/workflow";

import type { ReactNode } from "react";

export namespace WorkflowVersionPage {
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

export default function WorkflowVersionPage(
  props: WorkflowVersionPage.Props
): ReactNode {
  const { persistentId, versionId } = props.params;

  return (
    <WorkflowVersionPageContent
      persistentId={persistentId}
      versionId={Number(versionId)}
    />
  );
}
