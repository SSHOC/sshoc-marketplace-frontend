import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { FormSection } from "@/components/common/FormSection";
import { FormSectionTitle } from "@/components/common/FormSectionTitle";
import { ReviewMediaFormFieldArray } from "@/components/item-form/ReviewMediaFormFieldArray";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";

export interface MediaReviewFormSectionProps {
	formFields: ItemFormFields;
}

export function MediaReviewFormSection(props: MediaReviewFormSectionProps): ReactNode {
	const { fields } = props.formFields;

	const t = useTranslations();

	return (
		<FormSection>
			<FormSectionTitle>{t("authenticated.forms.media-section")}</FormSectionTitle>
			<ReviewMediaFormFieldArray field={fields.media} />
		</FormSection>
	);
}
