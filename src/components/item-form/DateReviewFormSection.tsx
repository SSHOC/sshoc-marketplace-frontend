import type { ReactNode } from "react";

import { FormSection } from "@/components/common/FormSection";
import { FormSectionTitle } from "@/components/common/FormSectionTitle";
import { ReviewField } from "@/components/item-form/ReviewField";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import type { ItemsDiff } from "@/data/sshoc/api/item";
import { FormDateField } from "@/lib/core/form/FormDateField";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { DateField } from "@/lib/core/ui/DateField/DateField";

export interface DateReviewFormSectionProps {
	formFields: ItemFormFields;
}

export function DateReviewFormSection(props: DateReviewFormSectionProps): ReactNode {
	const { category, fields } = props.formFields;

	const { t } = useI18n<"authenticated" | "common">();

	if (category === "dataset" || category === "publication" || category === "training-material") {
		return (
			<FormSection>
				<FormSectionTitle>{t(["authenticated", "forms", "date-section"])}</FormSectionTitle>

				<ReviewField<ItemsDiff["item"]["dateCreated"]>
					name={fields.label.name}
					// eslint-disable-next-line react/no-unstable-nested-components
					review={({ createLabel, status, value }) => {
						return (
							<DateField
								color={`review ${status}`}
								isReadOnly
								label={createLabel(fields.dateCreated.label)}
								value={value}
							/>
						);
					}}
				>
					<FormDateField {...fields.dateCreated} />
				</ReviewField>

				<ReviewField<ItemsDiff["item"]["dateLastUpdated"]>
					name={fields.label.name}
					// eslint-disable-next-line react/no-unstable-nested-components
					review={({ createLabel, status, value }) => {
						return (
							<DateField
								color={`review ${status}`}
								isReadOnly
								label={createLabel(fields.dateLastUpdated.label)}
								value={value}
							/>
						);
					}}
				>
					<FormDateField {...fields.dateLastUpdated} />
				</ReviewField>
			</FormSection>
		);
	}

	return null;
}
