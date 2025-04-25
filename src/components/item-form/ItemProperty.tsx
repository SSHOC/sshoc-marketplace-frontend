import type { Key } from "react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useForm } from "react-final-form";
import type { UseQueryResult } from "react-query";

import { ConceptComboBox } from "@/components/item-form/ConceptComboBox";
import { PropertyTypeSelect } from "@/components/item-form/PropertyTypeSelect";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import { ValueTextField } from "@/components/item-form/ValueTextField";
import type { GetPropertyTypes, PropertyConcept, PropertyType } from "@/data/sshoc/api/property";
import { usePublishPermission } from "@/data/sshoc/utils/usePublishPermission";
import { useFieldState } from "@/lib/core/form/useFieldState";

export interface ItemPropertyProps {
	fieldGroup: ItemFormFields["fields"]["properties"]["fields"];
	propertyTypes: UseQueryResult<GetPropertyTypes.Response, Error>;
	propertyTypesMap: Map<PropertyType["code"], PropertyType>;
}

export function ItemProperty(props: ItemPropertyProps): JSX.Element {
	const { fieldGroup, propertyTypes, propertyTypesMap } = props;

	const form = useForm();

	const hasPublishPermission = usePublishPermission();
	const items = useMemo(() => {
		if (propertyTypes.data?.propertyTypes == null) {
			return [];
		}

		if (hasPublishPermission) {
			return propertyTypes.data.propertyTypes;
		}

		return propertyTypes.data.propertyTypes.filter((propertyType) => {
			return propertyType.hidden !== true;
		});
	}, [propertyTypes.data, hasPublishPermission]);

	const selectedPropertyTypeId = useFieldState<PropertyType["code"] | undefined>(
		fieldGroup.type.name,
	).input.value;
	const selectedPropertyType =
		selectedPropertyTypeId != null ? propertyTypesMap.get(selectedPropertyTypeId) : null;

	const labelField = "label";
	const initialValue = useFieldState<PropertyConcept["concept"] | undefined>(
		fieldGroup.concept._root,
	).input.value;
	const initialSearchTerm = initialValue?.[labelField] ?? "";
	const [conceptSearchTerm, setConceptSearchTerm] = useState<string>(initialSearchTerm);

	/** Need to update input value when selection changes, but also when item moves to new array index. */
	useEffect(() => {
		setConceptSearchTerm(initialSearchTerm);
	}, [initialSearchTerm]);

	function onSelectionChange(key: Key | null) {
		const propertyType = key != null ? propertyTypesMap.get(key as string) : undefined;
		form.batch(() => {
			/** Store property type `type`, so we can use it in validation schema for `value`. */
			form.change([fieldGroup.type._root, "type"].join("."), propertyType?.type);
			/** Ensure fields are cleared correctly when changing property type. */
			form.change(fieldGroup.value.name, undefined);
			form.change(fieldGroup.concept._root, { uri: undefined });
		});
		setConceptSearchTerm("");
	}

	return (
		<Fragment>
			<PropertyTypeSelect
				field={fieldGroup.type}
				items={items}
				loadingState={propertyTypes.isLoading ? "loading" : "idle"}
				onSelectionChange={onSelectionChange}
			/>
			{selectedPropertyType == null ? null : selectedPropertyType.type === "concept" ? (
				<ConceptComboBox
					conceptSearchTerm={conceptSearchTerm}
					setConceptSearchTerm={setConceptSearchTerm}
					field={fieldGroup.concept}
					propertyTypeId={selectedPropertyType.code}
					allowedVocabularies={selectedPropertyType.allowedVocabularies}
				/>
			) : (
				<ValueTextField field={fieldGroup.value} propertyTypeId={selectedPropertyType.code} />
			)}
		</Fragment>
	);
}
