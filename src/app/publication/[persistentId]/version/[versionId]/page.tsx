import PublicationVersionPageContent from "@/app/publication/[persistentId]/version/[versionId]/publication-version-page";
import type { Publication } from "@/lib/data/sshoc/api/publication";
import type { ReactNode } from "react";

export namespace PublicationVersionPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Publication["persistentId"];
    versionId: Publication["id"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export default function PublicationVersionPage(
  props: PublicationVersionPage.Props
): ReactNode {
  const { persistentId, versionId } = props.params;

  return (
    <PublicationVersionPageContent
      persistentId={persistentId}
      versionId={Number(versionId)}
    />
  );
}
