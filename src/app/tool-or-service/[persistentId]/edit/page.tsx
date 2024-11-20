import EditToolOrServicePageContent from "@/app/tool-or-service/[persistentId]/edit/edit-tool-or-service-page";
import type { Tool, ToolInput } from "@/lib/data/sshoc/api/tool-or-service";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type { ReactNode } from "react";

export type UpdateToolOrServiceFormValues = ItemFormValues<ToolInput>;

export namespace EditToolOrServicePage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Tool["persistentId"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function EditToolOrServicePage(
  props: EditToolOrServicePage.Props
): ReactNode {
  const { persistentId } = props.params;

  return <EditToolOrServicePageContent persistentId={persistentId} />;
}
