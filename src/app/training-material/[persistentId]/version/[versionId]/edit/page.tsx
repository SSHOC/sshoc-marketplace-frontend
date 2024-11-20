import EditTrainingMaterialVersionPageContent from "@/app/training-material/[persistentId]/version/[versionId]/edit/edit-training-material-version-page";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type {
  TrainingMaterial,
  TrainingMaterialInput,
} from "@/lib/data/sshoc/api/training-material";
import type { ReactNode } from "react";

export type UpdateTrainingMaterialFormValues =
  ItemFormValues<TrainingMaterialInput>;

export namespace EditTrainingMaterialVersionPage {
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

export default function EditTrainingMaterialVersionPage(
  props: EditTrainingMaterialVersionPage.Props
): ReactNode {
  const { persistentId, versionId } = props.params;

  return (
    <EditTrainingMaterialVersionPageContent
      persistentId={persistentId}
      versionId={Number(versionId)}
    />
  );
}
