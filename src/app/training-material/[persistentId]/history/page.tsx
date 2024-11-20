import TrainingMaterialHistoryPageContent from "@/app/training-material/[persistentId]/history/training-material-history-page";
import type { TrainingMaterial } from "@/lib/data/sshoc/api/training-material";
import type { ReactNode } from "react";

export namespace TrainingMaterialHistoryPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: TrainingMaterial["persistentId"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function TrainingMaterialHistoryPage(
  props: TrainingMaterialHistoryPage.Props
): ReactNode {
  const { persistentId } = props.params;

  return <TrainingMaterialHistoryPageContent persistentId={persistentId} />;
}
