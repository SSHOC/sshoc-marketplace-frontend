import ToolOrServiceHistoryPageContent from "@/app/tool-or-service/[persistentId]/history/tool-or-service-history-page";
import type { Tool } from "@/lib/data/sshoc/api/tool-or-service";
import type { ReactNode } from "react";

export namespace ToolOrServiceHistoryPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Tool["persistentId"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function ToolOrServiceHistoryPage(
  props: ToolOrServiceHistoryPage.Props
): ReactNode {
  const { persistentId } = props.params;

  return <ToolOrServiceHistoryPageContent persistentId={persistentId} />;
}
