import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type { Tool, ToolInput } from "@/lib/data/sshoc/api/tool-or-service";

import ReviewToolOrServicePageContent from "@/app/tool-or-service/[persistentId]/version/[versionId]/review/review-tool-or-service-page";
import type { ReactNode } from "react";

export type UpdateToolOrServiceFormValues = ItemFormValues<ToolInput>;

export namespace ReviewToolOrServicePage {
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

export default function ReviewToolOrServicePage(
  props: ReviewToolOrServicePage.Props
): ReactNode {
  const { persistentId, versionId } = props.params;

  return (
    <ReviewToolOrServicePageContent
      persistentId={persistentId}
      versionId={Number(versionId)}
    />
  );
}
