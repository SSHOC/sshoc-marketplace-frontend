import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { FormSection } from "@/components/common/FormSection";
import { FormSectionTitle } from "@/components/common/FormSectionTitle";
import { RelatedItemsFormFieldArray } from "@/components/item-form/RelatedItemsFormFieldArray";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";

export interface RelatedItemFormSectionProps {
	formFields: ItemFormFields;
}

export function RelatedItemFormSection(props: RelatedItemFormSectionProps): ReactNode {
	const { fields } = props.formFields;

	const t = useTranslations();

	return (
		<FormSection>
			<FormSectionTitle>{t("authenticated.forms.related-items-section")}</FormSectionTitle>
			<RelatedItemsFormFieldArray field={fields.relatedItems} />
		</FormSection>
	);
}
