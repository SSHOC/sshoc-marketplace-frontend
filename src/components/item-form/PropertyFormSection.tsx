import type { ReactNode } from "react";

import { FormSection } from "@/components/common/FormSection";
import { FormSectionTitle } from "@/components/common/FormSectionTitle";
import { PropertiesFormFieldArray } from "@/components/item-form/PropertiesFormFieldArray";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import { useI18n } from "@/lib/core/i18n/useI18n";

export interface PropertyFormSectionProps {
	formFields: ItemFormFields;
}

export function PropertyFormSection(props: PropertyFormSectionProps): ReactNode {
	const { fields } = props.formFields;

	const { t } = useI18n<"authenticated" | "common">();

	return (
		<FormSection>
			<FormSectionTitle>{t(["authenticated", "forms", "properties-section"])}</FormSectionTitle>
			<PropertiesFormFieldArray field={fields.properties} />
		</FormSection>
	);
}
