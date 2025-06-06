import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useFieldArray } from "react-final-form-arrays";

import { FormFieldArray } from "@/components/common/FormFieldArray";
import { FormFieldArrayControls } from "@/components/common/FormFieldArrayControls";
import { FormFieldList } from "@/components/common/FormFieldList";
import { FormFieldListItem } from "@/components/common/FormFieldListItem";
import { FormFieldListItemControls } from "@/components/common/FormFieldListItemControls";
import { FormRecordAddButton } from "@/components/common/FormRecordAddButton";
import { FormRecordRemoveButton } from "@/components/common/FormRecordRemoveButton";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import { FormTextField } from "@/lib/core/form/FormTextField";

export interface AccessibleAtFormFieldArrayProps {
	field: ItemFormFields["fields"]["accessibleAt"];
}

export function AccessibleAtFormFieldArray(props: AccessibleAtFormFieldArrayProps): ReactNode {
	const { field } = props;

	const t = useTranslations();
	const fieldArray = useFieldArray<string | undefined>(field.name, { subscription: {} });

	function onAdd() {
		fieldArray.fields.push(undefined);
	}

	return (
		<FormFieldArray>
			<FormFieldList key={fieldArray.fields.length}>
				{fieldArray.fields.map((name, index) => {
					function onRemove() {
						fieldArray.fields.remove(index);
					}

					return (
						<FormFieldListItem key={name}>
							{/* eslint-disable-next-line react/jsx-no-leaked-render */}
							<FormTextField {...field} name={name} isRequired={field.isRequired && index === 0} />
							{(!field.isRequired || index > 0) && (
								<FormFieldListItemControls>
									<FormRecordRemoveButton
										aria-label={t("authenticated.forms.remove-field", {
											field: field.itemLabel,
										})}
										onPress={onRemove}
									>
										{t("authenticated.controls.delete")}
									</FormRecordRemoveButton>
								</FormFieldListItemControls>
							)}
						</FormFieldListItem>
					);
				})}
			</FormFieldList>
			<FormFieldArrayControls>
				<FormRecordAddButton onPress={onAdd}>
					{t("authenticated.forms.add-field", {
						field: field.itemLabel,
					})}
				</FormRecordAddButton>
			</FormFieldArrayControls>
		</FormFieldArray>
	);
}
