import ToolOrServiceVersionPageContent from "@/app/tool-or-service/[persistentId]/version/[versionId]/tool-or-service-version-page";
import type { Tool } from "@/lib/data/sshoc/api/tool-or-service";
import type { ReactNode } from "react";

export namespace ToolOrServiceVersionPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Tool["persistentId"];
    versionId: Tool["id"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function ToolOrServiceVersionPage(
  props: ToolOrServiceVersionPage.Props
): ReactNode {
  const { persistentId, versionId } = props.params;

  return (
    <ToolOrServiceVersionPageContent
      persistentId={persistentId}
      versionId={Number(versionId)}
    />
  );
}
