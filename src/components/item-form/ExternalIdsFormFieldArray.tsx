import { Fragment } from "react";
import { useFieldArray } from "react-final-form-arrays";

import { FormFieldArray } from "@/components/common/FormFieldArray";
import { FormFieldArrayControls } from "@/components/common/FormFieldArrayControls";
import { FormFieldGroup } from "@/components/common/FormFieldGroup";
import { FormFieldList } from "@/components/common/FormFieldList";
import { FormFieldListItem } from "@/components/common/FormFieldListItem";
import { FormFieldListItemControls } from "@/components/common/FormFieldListItemControls";
import { FormRecordAddButton } from "@/components/common/FormRecordAddButton";
import { FormRecordRemoveButton } from "@/components/common/FormRecordRemoveButton";
import { ItemIdentifierServiceSelect } from "@/components/item-form/ItemIdentifierServiceSelect";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import type { ItemExternalIdInput } from "@/data/sshoc/api/item";
import { useItemSources } from "@/data/sshoc/hooks/item";
import { FormTextField } from "@/lib/core/form/FormTextField";
import { useFieldState } from "@/lib/core/form/useFieldState";
import { useI18n } from "@/lib/core/i18n/useI18n";

export interface ExternalIdsFormFieldArrayProps {
	field: ItemFormFields["fields"]["externalIds"];
}

export function ExternalIdsFormFieldArray(props: ExternalIdsFormFieldArrayProps): JSX.Element {
	const { field } = props;

	const { t } = useI18n<"authenticated" | "common">();
	const fieldArray = useFieldArray<ItemExternalIdInput | UndefinedLeaves<ItemExternalIdInput>>(
		field.name,
		{ subscription: {} },
	);

	function onAdd() {
		fieldArray.fields.push({ identifier: undefined, identifierService: { code: undefined } });
	}

	return (
		<FormFieldArray>
			<FormFieldList key={fieldArray.fields.length}>
				{fieldArray.fields.map((name, index) => {
					function onRemove() {
						fieldArray.fields.remove(index);
					}

					const fieldGroup = {
						identifier: {
							...field.fields.identifier,
							name: [name, field.fields.identifier.name].join("."),
						},
						identifierService: {
							...field.fields.identifierService,
							name: [name, field.fields.identifierService.name].join("."),
							_root: [name, field.fields.identifierService._root].join("."),
						},
					};

					return (
						<FormFieldListItem key={name}>
							<FormFieldGroup>
								<ItemIdentifierServiceSelect field={fieldGroup.identifierService} />
								<ItemIdentifierField
									field={fieldGroup.identifier}
									identifierServiceFieldName={fieldGroup.identifierService.name}
								/>
							</FormFieldGroup>
							<FormFieldListItemControls>
								<FormRecordRemoveButton
									aria-label={t(["authenticated", "forms", "remove-field"], {
										values: { field: field.itemLabel },
									})}
									onPress={onRemove}
								>
									{t(["authenticated", "controls", "delete"])}
								</FormRecordRemoveButton>
							</FormFieldListItemControls>
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

export interface ItemIdentifierFieldProps {
	field: ItemFormFields["fields"]["externalIds"]["fields"]["identifier"];
	identifierServiceFieldName: string;
}

export function ItemIdentifierField(props: ItemIdentifierFieldProps): JSX.Element {
	const { field, identifierServiceFieldName } = props;

	const { t } = useI18n<"authenticated" | "common">();
	const service = useFieldState<string | null>(identifierServiceFieldName).input.value;
	const value = useFieldState<string | null>(field.name).input.value;
	const itemSources = useItemSources(undefined, { enabled: service != null && service.length > 0 });
	const sources = itemSources.data ?? [];
	const source = sources.find((source) => {
		return source.code === service;
	});
	const template = source?.urlTemplate?.replace(/\{source-item-id\}/, value ?? "");

	const description = (
		<Fragment>
			<span>{field.description}</span>
			{template != null ? (
				<span>
					{" "}
					{t(["authenticated", "itemExternalId", "description"], { values: { template } })}
				</span>
			) : null}
		</Fragment>
	);

	return <FormTextField {...field} description={description} />;
}
