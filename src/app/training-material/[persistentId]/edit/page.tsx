import EditTrainingMaterialPageContent from "@/app/training-material/[persistentId]/edit/edit-training-material-page";
import type {
  TrainingMaterial,
  TrainingMaterialInput,
} from "@/lib/data/sshoc/api/training-material";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type { ReactNode } from "react";

export type UpdateTrainingMaterialFormValues =
  ItemFormValues<TrainingMaterialInput>;

export namespace EditTrainingMaterialPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: TrainingMaterial["persistentId"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function EditTrainingMaterialPage(
  props: EditTrainingMaterialPage.Props
): ReactNode {
  const { persistentId } = props.params;

  return <EditTrainingMaterialPageContent persistentId={persistentId} />;
}
