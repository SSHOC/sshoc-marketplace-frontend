import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { FormSection } from "@/components/common/FormSection";
import { FormSectionTitle } from "@/components/common/FormSectionTitle";
import { MediaFormFieldArray } from "@/components/item-form/MediaFormFieldArray";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";

export interface MediaFormSectionProps {
	formFields: ItemFormFields;
}

export function MediaFormSection(props: MediaFormSectionProps): ReactNode {
	const { fields } = props.formFields;

	const t = useTranslations();

	return (
		<FormSection>
			<FormSectionTitle>{t("authenticated.forms.media-section")}</FormSectionTitle>
			<MediaFormFieldArray field={fields.media} />
		</FormSection>
	);
}
