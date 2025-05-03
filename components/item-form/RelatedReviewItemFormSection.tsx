import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { FormSection } from "@/components/common/FormSection";
import { FormSectionTitle } from "@/components/common/FormSectionTitle";
import { ReviewRelatedItemsFormFieldArray } from "@/components/item-form/ReviewRelatedItemsFormFieldArray";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";

export interface RelatedReviewItemFormSectionProps {
	formFields: ItemFormFields;
}

export function RelatedReviewItemFormSection(props: RelatedReviewItemFormSectionProps): ReactNode {
	const { fields } = props.formFields;

	const t = useTranslations();

	return (
		<FormSection>
			<FormSectionTitle>{t("authenticated.forms.related-items-section")}</FormSectionTitle>
			<ReviewRelatedItemsFormFieldArray field={fields.relatedItems} />
		</FormSection>
	);
}
