import EditDatasetVersionPageContent from "@/app/dataset/[persistentId]/version/[versionId]/edit/edit-dataset-version-page";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type { Dataset, DatasetInput } from "@/lib/data/sshoc/api/dataset";
import type { ReactNode } from "react";

export type UpdateDatasetFormValues = ItemFormValues<DatasetInput>;

export namespace EditDatasetVersionPage {
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

export default function EditDatasetVersionPage(
  props: EditDatasetVersionPage.Props
): ReactNode {
  const { persistentId, versionId } = props.params;

  return (
    <EditDatasetVersionPageContent
      persistentId={persistentId}
      versionId={Number(versionId)}
    />
  );
}
