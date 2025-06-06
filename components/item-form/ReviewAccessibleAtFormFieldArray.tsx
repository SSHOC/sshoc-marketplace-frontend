import { useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";
import { useFieldArray } from "react-final-form-arrays";

import { FormFieldArray } from "@/components/common/FormFieldArray";
import { FormFieldArrayControls } from "@/components/common/FormFieldArrayControls";
import { FormFieldList } from "@/components/common/FormFieldList";
import { FormFieldListItem } from "@/components/common/FormFieldListItem";
import { FormFieldListItemControls } from "@/components/common/FormFieldListItemControls";
import { FormRecordAddButton } from "@/components/common/FormRecordAddButton";
import { FormRecordRemoveButton } from "@/components/common/FormRecordRemoveButton";
import { ReviewFieldListItem } from "@/components/item-form/ReviewFieldListItem";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import type { ItemsDiff } from "@/data/sshoc/api/item";
import { FormTextField } from "@/lib/core/form/FormTextField";
import { TextField } from "@/lib/core/ui/TextField/TextField";

export interface ReviewAccessibleAtFormFieldArrayProps {
	field: ItemFormFields["fields"]["accessibleAt"];
}

export function ReviewAccessibleAtFormFieldArray(
	props: ReviewAccessibleAtFormFieldArrayProps,
): ReactNode {
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
							<ReviewFieldListItem<ItemsDiff["item"]["accessibleAt"][number]>
								name={name}
								fields={fieldArray.fields}
								index={index}
								// eslint-disable-next-line react/no-unstable-nested-components
								review={({ createLabel, status, value }) => {
									return (
										<TextField
											color={`review ${status}`}
											isReadOnly
											label={createLabel(field.itemLabel)}
											value={value}
										/>
									);
								}}
							>
								<Fragment>
									<FormTextField {...field} name={name} label={field.itemLabel} />
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
								</Fragment>
							</ReviewFieldListItem>
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
