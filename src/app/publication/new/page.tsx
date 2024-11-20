import CreatePublicationPageContent from "@/app/publication/new/create-publication-page";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type { PublicationInput } from "@/lib/data/sshoc/api/publication";
import type { ReactNode } from "react";

export type CreatePublicationFormValues = ItemFormValues<PublicationInput>;

export namespace CreatePublicationPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
}

export default function CreatePublicationPage(): ReactNode {
  return <CreatePublicationPageContent />;
}
