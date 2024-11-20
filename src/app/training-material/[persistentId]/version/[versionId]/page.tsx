import TrainingMaterialVersionPageContent from "@/app/training-material/[persistentId]/version/[versionId]/training-material-version-page";
import type { TrainingMaterial } from "@/lib/data/sshoc/api/training-material";
import type { ReactNode } from "react";

export namespace TrainingMaterialVersionPage {
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

export default function TrainingMaterialVersionPage(
  props: TrainingMaterialVersionPage.Props
): ReactNode {
  const { persistentId, versionId } = props.params;

  return (
    <TrainingMaterialVersionPageContent
      persistentId={persistentId}
      versionId={Number(versionId)}
    />
  );
}
