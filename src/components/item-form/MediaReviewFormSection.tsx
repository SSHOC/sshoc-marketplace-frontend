import { FormSection } from "@/components/common/FormSection";
import { FormSectionTitle } from "@/components/common/FormSectionTitle";
import { ReviewMediaFormFieldArray } from "@/components/item-form/ReviewMediaFormFieldArray";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import { useI18n } from "@/lib/core/i18n/useI18n";

export interface MediaReviewFormSectionProps {
	formFields: ItemFormFields;
}

export function MediaReviewFormSection(props: MediaReviewFormSectionProps): JSX.Element {
	const { fields } = props.formFields;

	const { t } = useI18n<"authenticated" | "common">();

	return (
		<FormSection>
			<FormSectionTitle>{t(["authenticated", "forms", "media-section"])}</FormSectionTitle>
			<ReviewMediaFormFieldArray field={fields.media} />
		</FormSection>
	);
}
