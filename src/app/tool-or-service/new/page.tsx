import CreateToolOrServicePageContent from "@/app/tool-or-service/new/create-tool-or-service-page";
import type { ReactNode } from "react";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type { ToolInput } from "@/lib/data/sshoc/api/tool-or-service";

export type CreateToolFormValues = ItemFormValues<ToolInput>;

export namespace CreateToolOrServicePage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
}

export default function CreateToolOrServicePage(): ReactNode {
  return <CreateToolOrServicePageContent />;
}
