import { Fragment } from "react";

import css from "@/components/common/ItemPreviewMetadata.module.css";
import { Link } from "@/components/common/Link";
import { useSearchItems } from "@/components/common/useSearchItems";
import type {
  ItemFacet,
  ItemSearchResult,
  ItemWithWorkflowStep,
  RelatedItem,
} from "@/lib/data/sshoc/api/item";
import type { PropertyConcept } from "@/lib/data/sshoc/api/property";
import { isPropertyConcept } from "@/lib/data/sshoc/api/property";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { maxPreviewMetadataValues } from "~/config/sshoc.config";

export interface ItemPreviewMetadataProps {
  item: ItemSearchResult | ItemWithWorkflowStep | RelatedItem;
}

export function ItemPreviewMetadata(
  props: ItemPreviewMetadataProps
): JSX.Element {
  const { item } = props;

  const { t } = useI18n<"common">();

  const { activities, keywords } = useItemPreviewMetadata({
    properties: "properties" in item ? item.properties : [],
  });

  if (activities.length === 0 && keywords.length === 0) {
    return <Fragment />;
  }

  return (
    <dl className={css["metadata"]}>
      <ItemPreviewMetadataValueList
        label={t(["common", "facets", "activity", "other"])}
        properties={activities}
        facet="activity"
      />
      <ItemPreviewMetadataValueList
        label={t(["common", "facets", "keyword", "other"])}
        properties={keywords}
        facet="keyword"
      />
    </dl>
  );
}

interface UseItemPreviewMetadataArgs {
  properties: ItemSearchResult["properties"];
}

function useItemPreviewMetadata(options: UseItemPreviewMetadataArgs) {
  const { properties } = options;

  const conceptBasedProperties = properties.filter(isPropertyConcept);

  const activities = conceptBasedProperties
    .filter((property) => {
      return property.type.code === "activity";
    })
    .slice(0, maxPreviewMetadataValues);

  const keywords = conceptBasedProperties
    .filter((property) => {
      return property.type.code === "keyword";
    })
    .slice(0, maxPreviewMetadataValues);

  return { activities, keywords };
}

interface ItemPreviewMetadataValueListProps {
  label: string;
  properties: Array<PropertyConcept>;
  facet: ItemFacet;
}

function ItemPreviewMetadataValueList(
  props: ItemPreviewMetadataValueListProps
): JSX.Element {
  const { label, properties, facet } = props;

  const { getSearchItemsLink } = useSearchItems();

  if (properties.length === 0) {
    return <Fragment />;
  }

  return (
    <Fragment>
      <dt>{label}</dt>
      <dd>
        <ul role="list" className={css["metadata-terms"]}>
          {properties.map((property) => {
            const query = { [`f.${facet}`]: [property.concept.label] } as {
              [K in ItemFacet as `f.${K}`]: Array<string>;
            };

            return (
              <li key={property.concept.code}>
                <Link {...getSearchItemsLink(query)}>
                  {property.concept.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </dd>
    </Fragment>
  );
}
