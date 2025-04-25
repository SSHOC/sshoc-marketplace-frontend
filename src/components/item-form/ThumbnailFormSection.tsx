import type { ReactNode } from "react";

import { FormSection } from "@/components/common/FormSection";
import { FormSectionTitle } from "@/components/common/FormSectionTitle";
import { ThumbnailFormField } from "@/components/item-form/ThumbnailFormField";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import { useI18n } from "@/lib/core/i18n/useI18n";

export interface ThumbnailFormSectionProps {
	formFields: ItemFormFields;
}

export function ThumbnailFormSection(props: ThumbnailFormSectionProps): ReactNode {
	const { fields } = props.formFields;

	const { t } = useI18n<"authenticated" | "common">();

	return (
		<FormSection>
			<FormSectionTitle>{t(["authenticated", "forms", "thumbnail-section"])}</FormSectionTitle>
			<ThumbnailFormField field={fields.thumbnail} />
		</FormSection>
	);
}
