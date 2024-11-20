import EditPublicationPageContent from "@/app/publication/[persistentId]/edit/edit-publication-page";

import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type {
  Publication,
  PublicationInput,
} from "@/lib/data/sshoc/api/publication";
import type { ReactNode } from "react";

export type UpdatePublicationFormValues = ItemFormValues<PublicationInput>;

export namespace EditPublicationPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Publication["persistentId"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function EditPublicationPage(
  props: EditPublicationPage.Props
): ReactNode {
  const { persistentId } = props.params;

  return <EditPublicationPageContent persistentId={persistentId} />;
}
