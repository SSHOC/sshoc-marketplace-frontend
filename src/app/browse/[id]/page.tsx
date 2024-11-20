import BrowsePageContent from "@/app/browse/[id]/browse-page";
import { createI18n } from "@/lib/core/i18n/createI18n";
import { itemFacets, type ItemFacet } from "@/lib/data/sshoc/api/item";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export namespace BrowsePage {
  export interface PathParamsInput extends ParamsInput {
    id: ItemFacet;
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

export function generateStaticParams() {
  return itemFacets.map((id) => {
    return { id };
  });
}

export function generateMetadata(props: BrowsePage.Props) {
  const { id } = props.params;

  const { t } = createI18n();

  const title = t(["common", "browse", "browse-facet"], {
    values: { facet: t(["common", "facets", id as ItemFacet, "other"]) },
  });

  const metadata: Metadata = {
    title,
  };

  return metadata;
}

export default function BrowsePage(props: BrowsePage.Props): ReactNode {
  const { id } = props.params;

  return <BrowsePageContent id={id as ItemFacet} />;
}
