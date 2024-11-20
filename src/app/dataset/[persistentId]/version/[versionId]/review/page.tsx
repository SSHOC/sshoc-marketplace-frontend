import ReviewDatasetPageContent from "@/app/dataset/[persistentId]/version/[versionId]/review/review-dataset-page";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type { Dataset, DatasetInput } from "@/lib/data/sshoc/api/dataset";
import type { ReactNode } from "react";

export type UpdateDatasetFormValues = ItemFormValues<DatasetInput>;

export namespace ReviewDatasetPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Dataset["persistentId"];
    versionId: Dataset["id"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function ReviewDatasetPage(
  props: ReviewDatasetPage.Props
): ReactNode {
  const { persistentId, versionId } = props.params;

  return (
    <ReviewDatasetPageContent
      persistentId={persistentId}
      versionId={Number(versionId)}
    />
  );
}
