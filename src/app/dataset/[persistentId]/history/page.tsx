import DatasetHistoryPageContent from "@/app/dataset/[persistentId]/history/dataset-history-page";
import type { ReactNode } from "react";
import type { Dataset } from "@/lib/data/sshoc/api/dataset";

export namespace DatasetHistoryPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Dataset["persistentId"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function DatasetHistoryPage(
  props: DatasetHistoryPage.Props
): ReactNode {
  const { persistentId } = props.params;

  return <DatasetHistoryPageContent persistentId={persistentId} />;
}
