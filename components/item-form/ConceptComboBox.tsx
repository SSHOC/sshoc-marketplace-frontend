import { useTranslations } from "next-intl";
import type { Key, ReactNode } from "react";
import { Fragment, useMemo } from "react";
import { useForm } from "react-final-form";

import { ItemInfo } from "@/components/common/ItemInfo";
import { SeeVocabularyLink } from "@/components/item-form/SeeVocabularyLink";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import { debounceDelay } from "@/config/sshoc.config";
import type { PropertyType } from "@/data/sshoc/api/property";
import { useConceptSearchInfinite } from "@/data/sshoc/hooks/vocabulary";
import { FormComboBox } from "@/lib/core/form/FormComboBox";
import { Item } from "@/lib/core/ui/Collection/Item";
import { mapBy } from "@/lib/utils";
import { useDebouncedState } from "@/lib/utils/hooks/useDebouncedState";

export interface ConceptComboBoxProps {
	conceptSearchTerm: string;
	setConceptSearchTerm: (searchTerm: string) => void;
	field: ItemFormFields["fields"]["properties"]["fields"]["concept"];
	propertyTypeId: PropertyType["code"];
}

export function ConceptComboBox(props: ConceptComboBoxProps): ReactNode {
	const { conceptSearchTerm, field, propertyTypeId, setConceptSearchTerm } = props;

	const t = useTranslations();
	const form = useForm();

	const idField = "uri";
	const labelField = "label";
	const labelFieldName = [field._root, labelField].join(".");

	const debouncedConceptSearchTerm = useDebouncedState({
		value: conceptSearchTerm,
		delay: debounceDelay,
	});
	// TODO: `placeholderData`
	const conceptSearchResults = useConceptSearchInfinite({
		q: debouncedConceptSearchTerm.length > 0 ? debouncedConceptSearchTerm : undefined,
		order: "label",
		types: [propertyTypeId],
	});
	const items = useMemo(() => {
		if (conceptSearchResults.data?.pages == null) {
			return [];
		}
		return conceptSearchResults.data.pages.flatMap((page) => {
			return page.concepts;
		});
	}, [conceptSearchResults.data?.pages]);
	const itemsById = useMemo(() => {
		return mapBy(items, idField);
	}, [items]);

	function onSelectionChange(id: Key | null) {
		if (id == null) {
			form.change(labelFieldName, undefined);
			setConceptSearchTerm("");
		} else {
			const item = itemsById.get(id as string);
			const label = item?.[labelField];
			form.change(labelFieldName, label);
			setConceptSearchTerm(label ?? "");
		}
	}

	const loadingState = conceptSearchResults.isLoading
		? "loading"
		: conceptSearchResults.isFetchingNextPage
			? "loadingMore"
			: "idle";

	const description = (
		<Fragment>
			<span>{field.description} </span>
			<span>
				{/* @ts-expect-error Assume all possible property types have translation. */}
				{t.rich(`authenticated.properties.${propertyTypeId}.description`, {
					// eslint-disable-next-line react/no-unstable-nested-components
					Link() {
						return <SeeVocabularyLink type={propertyTypeId} />;
					},
				})}
			</span>
		</Fragment>
	);

	return (
		<FormComboBox
			{...field}
			description={description}
			inputValue={conceptSearchTerm}
			items={items}
			layout={layout}
			loadingState={loadingState}
			onInputChange={setConceptSearchTerm}
			onLoadMore={
				conceptSearchResults.hasNextPage === true && conceptSearchResults.isSuccess
					? conceptSearchResults.fetchNextPage
					: undefined
			}
			onSelectionChange={onSelectionChange}
		>
			{(item) => {
				return (
					<Item key={item[idField]} textValue={item[labelField]}>
						{item[labelField]}
						<ItemInfo>{item.uri}</ItemInfo>
					</Item>
				);
			}}
		</FormComboBox>
	);
}

const layout = {
	estimatedRowHeight: 60,
};
