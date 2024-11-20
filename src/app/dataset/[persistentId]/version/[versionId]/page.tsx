import DatasetVersionPageContent from "@/app/dataset/[persistentId]/version/[versionId]/dataset-version-page";
import type { Dataset } from "@/lib/data/sshoc/api/dataset";
import type { ReactNode } from "react";

export namespace DatasetVersionPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Dataset["persistentId"];
    versionId: Dataset["id"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export interface SearchParamsInput {
    draft?: boolean;
  }
  export interface Props {
    params: PathParams;
  }
}

export default function DatasetVersionPage(
  props: DatasetVersionPage.Props
): ReactNode {
  const { persistentId, versionId } = props.params;

  return (
    <DatasetVersionPageContent
      persistentId={persistentId}
      versionId={Number(versionId)}
    />
  );
}
