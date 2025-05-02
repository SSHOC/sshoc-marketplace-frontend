import type { ReactNode } from "react";

import { SourceFormControls } from "@/components/account/SourceFormControls";
import { useSourceFormFields } from "@/components/account/useSourceFormFields";
import { FormSection } from "@/components/common/FormSection";
import type { SourceInput } from "@/data/sshoc/api/source";
import { sourceInputSchema } from "@/data/sshoc/validation-schemas/source";
import { Form } from "@/lib/core/form/Form";
import { FormTextField } from "@/lib/core/form/FormTextField";
import { validateSchema } from "@/lib/core/form/validateSchema";

export type SourceFormValues = SourceInput;

export interface SourceFormProps {
	initialValues?: Partial<SourceFormValues>;
	name?: string;
	onCancel: () => void;
	onSubmit: (source: SourceFormValues) => void;
}

export function SourceForm(props: SourceFormProps): ReactNode {
	const { initialValues, name, onCancel, onSubmit } = props;

	const fields = useSourceFormFields();

	return (
		<Form
			initialValues={initialValues}
			name={name}
			onSubmit={onSubmit}
			validate={validateSchema(sourceInputSchema)}
		>
			<FormSection>
				<FormTextField {...fields.label} />
				<FormTextField {...fields.url} />
				<FormTextField {...fields.urlTemplate} />

				<SourceFormControls onCancel={onCancel} />
			</FormSection>
		</Form>
	);
}
