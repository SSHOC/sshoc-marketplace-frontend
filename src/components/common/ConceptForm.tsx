import type { ReactNode } from "react";
import { z } from "zod";

import { ConceptFormControls } from "@/components/common/ConceptFormControls";
import { FormSection } from "@/components/common/FormSection";
import { useConceptFormFields } from "@/components/common/useConceptFormFields";
import type { PropertyType } from "@/data/sshoc/api/property";
import type { ConceptInput, Vocabulary } from "@/data/sshoc/api/vocabulary";
import {
	conceptInputSchema,
	vocabularyRefSchema,
} from "@/data/sshoc/validation-schemas/vocabulary";
import { Form } from "@/lib/core/form/Form";
import { FormSelect } from "@/lib/core/form/FormSelect";
import { FormTextField } from "@/lib/core/form/FormTextField";
import { validateSchema } from "@/lib/core/form/validateSchema";
import { Item } from "@/lib/core/ui/Collection/Item";

export type ConceptFormValues = ConceptInput & { vocabulary: { code: Vocabulary["code"] } };

export interface ConceptFormProps {
	propertyType: PropertyType;
	initialValues?: Partial<ConceptFormValues>;
	name?: string;
	onCancel: () => void;
	onSubmit: (concept: ConceptFormValues) => void;
}

export function ConceptForm(props: ConceptFormProps): ReactNode {
	const { initialValues, name, onCancel, onSubmit, propertyType } = props;

	const fields = useConceptFormFields();

	return (
		<Form
			initialValues={initialValues}
			name={name}
			onSubmit={onSubmit}
			validate={async (values) => {
				const result = await validateSchema(
					conceptInputSchema.merge(z.object({ vocabulary: vocabularyRefSchema })),
				)(
					// @ts-expect-error Ensure the validation error is put on `vocabulary.code`, not `vocabulary`.
					{ vocabulary: {}, ...values },
				);
				return result;
			}}
		>
			<FormSection>
				<FormSelect
					{...fields.vocabulary}
					items={propertyType.allowedVocabularies.filter((vocabulary) => {
						return !vocabulary.closed;
					})}
				>
					{(item) => {
						return <Item key={item.code}>{item.label}</Item>;
					}}
				</FormSelect>
				<FormTextField {...fields.label} />
				<FormTextField {...fields.notation} />
				<FormTextField {...fields.definition} />

				<ConceptFormControls onCancel={onCancel} />
			</FormSection>
		</Form>
	);
}
