import { useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import css from "@/components/common/ItemPreviewMetadata.module.css";
import { Link } from "@/components/common/Link";
import { useSearchItems } from "@/components/common/useSearchItems";
import { maxPreviewMetadataValues } from "@/config/sshoc.config";
import type {
	ItemFacet,
	ItemSearchResult,
	ItemWithWorkflowStep,
	RelatedItem,
} from "@/data/sshoc/api/item";
import type { PropertyConcept } from "@/data/sshoc/api/property";
import { isPropertyConcept } from "@/data/sshoc/api/property";

export interface ItemPreviewMetadataProps {
	children?: ReactNode;
	item: ItemSearchResult | ItemWithWorkflowStep | RelatedItem;
}

export function ItemPreviewMetadata(props: ItemPreviewMetadataProps): ReactNode {
	const { children, item } = props;

	const t = useTranslations();

	const { activities, keywords } = useItemPreviewMetadata({
		properties: "properties" in item ? item.properties : [],
	});

	if (activities.length === 0 && keywords.length === 0 && children == null) {
		return null;
	}

	return (
		<dl className={css["metadata"]}>
			<ItemPreviewMetadataValueList
				label={t("common.facets.activity.other")}
				properties={activities}
				facet="activity"
			/>
			<ItemPreviewMetadataValueList
				label={t("common.facets.keyword.other")}
				properties={keywords}
				facet="keyword"
			/>
			{children}
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

function ItemPreviewMetadataValueList(props: ItemPreviewMetadataValueListProps): ReactNode {
	const { label, properties, facet } = props;

	const { getSearchItemsLink } = useSearchItems();

	if (properties.length === 0) {
		return null;
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
								<Link {...getSearchItemsLink(query)}>{property.concept.label}</Link>
							</li>
						);
					})}
				</ul>
			</dd>
		</Fragment>
	);
}
