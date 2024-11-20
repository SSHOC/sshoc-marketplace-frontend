import CreateTrainingMaterialPageContent from "@/app/training-material/new/create-training-material-page";
import type { TrainingMaterialInput } from "@/lib/data/sshoc/api/training-material";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type { ReactNode } from "react";

export type CreateTrainingMaterialFormValues =
  ItemFormValues<TrainingMaterialInput>;

export namespace CreateTrainingMaterialPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
}

export default function CreateTrainingMaterialPage(): ReactNode {
  return <CreateTrainingMaterialPageContent />;
}
