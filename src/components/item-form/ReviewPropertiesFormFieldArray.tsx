import { Fragment, type ReactNode, useMemo } from "react";
import { useFieldArray } from "react-final-form-arrays";

import { FormFieldArray } from "@/components/common/FormFieldArray";
import { FormFieldArrayControls } from "@/components/common/FormFieldArrayControls";
import { FormFieldGroup } from "@/components/common/FormFieldGroup";
import { FormFieldList } from "@/components/common/FormFieldList";
import { FormFieldListItem } from "@/components/common/FormFieldListItem";
import { FormFieldListItemControls } from "@/components/common/FormFieldListItemControls";
import { FormRecordAddButton } from "@/components/common/FormRecordAddButton";
import { FormRecordRemoveButton } from "@/components/common/FormRecordRemoveButton";
import { CreateConceptButton } from "@/components/item-form/CreateConceptButton";
import { ItemProperty } from "@/components/item-form/ItemProperty";
import { ReviewFieldListItem } from "@/components/item-form/ReviewFieldListItem";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import type { ItemsDiff } from "@/data/sshoc/api/item";
import type { PropertyInput, PropertyType } from "@/data/sshoc/api/property";
import { isPropertyConcept } from "@/data/sshoc/api/property";
import { usePropertyTypes } from "@/data/sshoc/hooks/property";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { TextField } from "@/lib/core/ui/TextField/TextField";
import { mapBy } from "@/lib/utils";

export interface ReviewPropertiesFormFieldArrayProps {
	field: ItemFormFields["fields"]["properties"];
}

export function ReviewPropertiesFormFieldArray(
	props: ReviewPropertiesFormFieldArrayProps,
): ReactNode {
	const { field } = props;

	const { t, createCollator } = useI18n<"authenticated" | "common">();
	const compare = createCollator();
	const fieldArray = useFieldArray<PropertyInput | UndefinedLeaves<PropertyInput>>(field.name, {
		subscription: {},
	});

	function onAdd() {
		fieldArray.fields.push({
			type: { code: undefined, type: undefined },
			// value: undefined,
			concept: { uri: undefined },
		});
	}

	const propertyTypes = usePropertyTypes({ perpage: 100 }, undefined, {
		select(data) {
			data.propertyTypes.sort((a, b) => {
				return compare(a.label, b.label);
			});

			return data;
		},
	});
	const propertyTypesMap = useMemo(() => {
		if (propertyTypes.data == null) {
			return new Map<PropertyType["code"], PropertyType>();
		}
		return mapBy(propertyTypes.data.propertyTypes, "code");
	}, [propertyTypes.data]);

	return (
		<FormFieldArray>
			<FormFieldList key={fieldArray.fields.length}>
				{fieldArray.fields.map((name, index) => {
					function onRemove() {
						fieldArray.fields.remove(index);
					}

					const fieldGroup = {
						type: {
							...field.fields.type,
							name: [name, field.fields.type.name].join("."),
							_root: [name, field.fields.type._root].join("."),
						},
						value: {
							...field.fields.value,
							name: [name, field.fields.value.name].join("."),
						},
						concept: {
							...field.fields.concept,
							name: [name, field.fields.concept.name].join("."),
							_root: [name, field.fields.concept._root].join("."),
						},
					};

					return (
						<FormFieldListItem key={name}>
							<ReviewFieldListItem<ItemsDiff["item"]["properties"][number]>
								name={name}
								fields={fieldArray.fields}
								index={index}
								// eslint-disable-next-line react/no-unstable-nested-components
								review={({ createLabel, status, value }) => {
									return (
										<FormFieldGroup>
											<TextField
												color={`review ${status}`}
												isReadOnly
												label={createLabel(fieldGroup.type.label)}
												value={value?.type.label}
											/>
											<TextField
												color={`review ${status}`}
												isReadOnly
												label={createLabel(
													value?.type.type === "concept"
														? fieldGroup.concept.label
														: fieldGroup.value.label,
												)}
												value={
													value != null && isPropertyConcept(value)
														? value.concept.label
														: value?.value
												}
											/>
										</FormFieldGroup>
									);
								}}
							>
								<Fragment>
									<FormFieldGroup>
										<ItemProperty
											fieldGroup={fieldGroup}
											propertyTypes={propertyTypes}
											propertyTypesMap={propertyTypesMap}
										/>
									</FormFieldGroup>
									<FormFieldListItemControls>
										<CreateConceptButton
											fieldGroup={fieldGroup}
											propertyTypesMap={propertyTypesMap}
										/>
										<FormRecordRemoveButton
											aria-label={t(["authenticated", "forms", "remove-field"], {
												values: { field: field.itemLabel },
											})}
											onPress={onRemove}
										>
											{t(["authenticated", "controls", "delete"])}
										</FormRecordRemoveButton>
									</FormFieldListItemControls>
								</Fragment>
							</ReviewFieldListItem>
						</FormFieldListItem>
					);
				})}
			</FormFieldList>
			<FormFieldArrayControls>
				<FormRecordAddButton onPress={onAdd}>
					{t(["authenticated", "forms", "add-field"], {
						values: { field: field.itemLabel },
					})}
				</FormRecordAddButton>
			</FormFieldArrayControls>
		</FormFieldArray>
	);
}
