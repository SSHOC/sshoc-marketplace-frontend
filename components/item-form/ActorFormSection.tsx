import type { ReactNode } from "react";

import { CreateActorButton } from "@/components/common/CreateActorButton";
import { FormSection } from "@/components/common/FormSection";
import { FormSectionTitle } from "@/components/common/FormSectionTitle";
import { ActorsFormFieldArray } from "@/components/item-form/ActorsFormFieldArray";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { SpacedRow } from "@/lib/core/ui/SpacedRow/SpacedRow";

export interface ActorFormSectionProps {
	formFields: ItemFormFields;
}

export function ActorFormSection(props: ActorFormSectionProps): ReactNode {
	const { fields } = props.formFields;

	const { t } = useI18n<"authenticated" | "common">();

	return (
		<FormSection>
			<SpacedRow>
				<FormSectionTitle>{t(["authenticated", "forms", "actors-section"])}</FormSectionTitle>
				<CreateActorButton variant="button-link" />
			</SpacedRow>
			<ActorsFormFieldArray field={fields.contributors} />
		</FormSection>
	);
}
