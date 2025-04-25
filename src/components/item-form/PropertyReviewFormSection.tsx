import { FormSection } from "@/components/common/FormSection";
import { FormSectionTitle } from "@/components/common/FormSectionTitle";
import { ReviewPropertiesFormFieldArray } from "@/components/item-form/ReviewPropertiesFormFieldArray";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import { useI18n } from "@/lib/core/i18n/useI18n";

export interface PropertyReviewFormSectionProps {
	formFields: ItemFormFields;
}

export function PropertyReviewFormSection(props: PropertyReviewFormSectionProps): JSX.Element {
	const { fields } = props.formFields;

	const { t } = useI18n<"authenticated" | "common">();

	return (
		<FormSection>
			<FormSectionTitle>{t(["authenticated", "forms", "properties-section"])}</FormSectionTitle>
			<ReviewPropertiesFormFieldArray field={fields.properties} />
		</FormSection>
	);
}
