import EditDatasetPageContent from "@/app/dataset/[persistentId]/edit/edit-dataset-page";

import type { Dataset, DatasetInput } from "@/lib/data/sshoc/api/dataset";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type { ReactNode } from "react";

export type UpdateDatasetFormValues = ItemFormValues<DatasetInput>;

export namespace EditDatasetPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Dataset["persistentId"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function EditDatasetPage(
  props: EditDatasetPage.Props
): ReactNode {
  const { persistentId } = props.params;

  return <EditDatasetPageContent persistentId={persistentId} />;
}
