import ReviewTrainingMaterialPageContent from "@/app/training-material/[persistentId]/version/[versionId]/review/review-training-material-version-page";
import type {
  TrainingMaterial,
  TrainingMaterialInput,
} from "@/lib/data/sshoc/api/training-material";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type { ReactNode } from "react";

export type UpdateTrainingMaterialFormValues =
  ItemFormValues<TrainingMaterialInput>;

export namespace ReviewTrainingMaterialPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: TrainingMaterial["persistentId"];
    versionId: TrainingMaterial["id"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function ReviewTrainingMaterialPage(
  props: ReviewTrainingMaterialPage.Props
): ReactNode {
  const { persistentId, versionId } = props.params;

  return (
    <ReviewTrainingMaterialPageContent
      persistentId={persistentId}
      versionId={Number(versionId)}
    />
  );
}
