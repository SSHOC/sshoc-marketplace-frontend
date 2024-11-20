import ToolOrServicePageContent from "@/app/tool-or-service/[persistentId]/tool-or-service-page";
import type { Tool } from "@/lib/data/sshoc/api/tool-or-service";
import type { ReactNode } from "react";

export namespace ToolOrServicePage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Tool["persistentId"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function ToolOrServicePage(
  props: ToolOrServicePage.Props
): ReactNode {
  const { persistentId } = props.params;

  return <ToolOrServicePageContent persistentId={persistentId} />;
}
