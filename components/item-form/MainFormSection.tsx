import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { FormSection } from "@/components/common/FormSection";
import { FormSectionTitle } from "@/components/common/FormSectionTitle";
import { AccessibleAtFormFieldArray } from "@/components/item-form/AccessibleAtFormFieldArray";
import { ExternalIdsFormFieldArray } from "@/components/item-form/ExternalIdsFormFieldArray";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import { FormTextArea } from "@/lib/core/form/FormTextArea";
import { FormTextField } from "@/lib/core/form/FormTextField";

export interface MainFormSectionProps {
	formFields: ItemFormFields;
}

export function MainFormSection(props: MainFormSectionProps): ReactNode {
	const { fields } = props.formFields;

	const t = useTranslations();

	return (
		<FormSection>
			<VisuallyHidden>
				<FormSectionTitle>{t("authenticated.forms.main-section")}</FormSectionTitle>
			</VisuallyHidden>
			<FormTextField {...fields.label} />
			<FormTextArea {...fields.description} rows={6} />
			<AccessibleAtFormFieldArray field={fields.accessibleAt} />
			<FormTextField {...fields.version} />
			<ExternalIdsFormFieldArray field={fields.externalIds} />
		</FormSection>
	);
}
