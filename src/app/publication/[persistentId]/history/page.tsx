import PublicationHistoryPageContent from "@/app/publication/[persistentId]/history/publication-history-page";
import type { ReactNode } from "react";
import type { Publication } from "@/lib/data/sshoc/api/publication";

export namespace PublicationHistoryPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Publication["persistentId"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function PublicationHistoryPage(
  props: PublicationHistoryPage.Props
): ReactNode {
  const { persistentId } = props.params;

  return <PublicationHistoryPageContent persistentId={persistentId} />;
}
