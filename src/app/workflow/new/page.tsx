import CreateWorkflowPageContent from "@/app/workflow/new/create-workflow-page";
import type { ReactNode } from "react";

export namespace CreateWorkflowPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
}

export default function CreateWorkflowPage(): ReactNode {
  return <CreateWorkflowPageContent />;
}
