import PublicationPageContent from "@/app/publication/[persistentId]/publication-page";
import type { Publication } from "@/lib/data/sshoc/api/publication";
import type { ReactNode } from "react";

export namespace PublicationPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Publication["persistentId"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function PublicationPage(
  props: PublicationPage.Props
): ReactNode {
  const { persistentId } = props.params;

  return <PublicationPageContent persistentId={persistentId} />;
}
