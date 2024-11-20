import EditPublicationVersionPageContent from "@/app/publication/[persistentId]/version/[versionId]/edit/edit-publication-version-page";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import type {
  Publication,
  PublicationInput,
} from "@/lib/data/sshoc/api/publication";
export type UpdatePublicationFormValues = ItemFormValues<PublicationInput>;

export namespace EditPublicationVersionPage {
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

export default function EditPublicationVersionPage(
  props: EditPublicationVersionPage.Props
): JSX.Element {
  const { persistentId, versionId } = props.params;

  return (
    <EditPublicationVersionPageContent
      persistentId={persistentId}
      versionId={Number(versionId)}
    />
  );
}
