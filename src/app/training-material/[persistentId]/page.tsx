import TrainingMaterialPageContent from "@/app/training-material/[persistentId]/training-material-page";
import type { TrainingMaterial } from "@/lib/data/sshoc/api/training-material";
import type { ReactNode } from "react";

export namespace TrainingMaterialPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: TrainingMaterial["persistentId"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function TrainingMaterialPage(
  props: TrainingMaterialPage.Props
): ReactNode {
  const { persistentId } = props.params;

  return <TrainingMaterialPageContent persistentId={persistentId} />;
}
