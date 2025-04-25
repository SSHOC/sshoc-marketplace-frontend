import { FormSection } from "@/components/common/FormSection";
import { FormSectionTitle } from "@/components/common/FormSectionTitle";
import { ReviewThumbnailFormField } from "@/components/item-form/ReviewThumbnailFormField";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import { useI18n } from "@/lib/core/i18n/useI18n";

export interface ThumbnailReviewFormSectionProps {
	formFields: ItemFormFields;
}

export function ThumbnailReviewFormSection(props: ThumbnailReviewFormSectionProps): JSX.Element {
	const { fields } = props.formFields;

	const { t } = useI18n<"authenticated" | "common">();

	return (
		<FormSection>
			<FormSectionTitle>{t(["authenticated", "forms", "thumbnail-section"])}</FormSectionTitle>
			<ReviewThumbnailFormField field={fields.thumbnail} />
		</FormSection>
	);
}
