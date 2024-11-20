import ReviewPublicationPageContent from "@/app/publication/[persistentId]/version/[versionId]/review/review-publication-page";
import type {
  Publication,
  PublicationInput,
} from "@/lib/data/sshoc/api/publication";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type { ReactNode } from "react";

export type UpdatePublicationFormValues = ItemFormValues<PublicationInput>;

export namespace ReviewPublicationPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Publication["persistentId"];
    versionId: Publication["id"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function ReviewPublicationPage(
  props: ReviewPublicationPage.Props
): ReactNode {
  const { persistentId, versionId } = props.params;

  return (
    <ReviewPublicationPageContent
      persistentId={persistentId}
      versionId={Number(versionId)}
    />
  );
}
