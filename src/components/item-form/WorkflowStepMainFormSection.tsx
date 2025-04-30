import { VisuallyHidden } from "@react-aria/visually-hidden";
import type { ReactNode } from "react";

import { FormSection } from "@/components/common/FormSection";
import { FormSectionTitle } from "@/components/common/FormSectionTitle";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import { FormTextArea } from "@/lib/core/form/FormTextArea";
import { FormTextField } from "@/lib/core/form/FormTextField";
import { useI18n } from "@/lib/core/i18n/useI18n";

export interface WorkflowStepMainFormSectionProps {
	formFields: ItemFormFields;
}

export function WorkflowStepMainFormSection(props: WorkflowStepMainFormSectionProps): ReactNode {
	const { fields } = props.formFields;

	const { t } = useI18n<"authenticated" | "common">();

	return (
		<FormSection>
			<VisuallyHidden>
				<FormSectionTitle>{t(["authenticated", "forms", "main-section"])}</FormSectionTitle>
			</VisuallyHidden>
			<FormTextField {...fields.label} />
			<FormTextArea {...fields.description} rows={6} />
		</FormSection>
	);
}
