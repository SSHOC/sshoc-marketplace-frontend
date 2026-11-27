import { Label, TextContext, useSlottedContext } from "react-aria-components";

import { Field, type FieldProps } from "@/lib/core/ui/Field/Field";

/** Connect RAC's accessible slots to the shared field presentation. */
export function AriaField(props: FieldProps) {
	const descriptionProps = useSlottedContext(TextContext, "description");
	const errorMessageProps = useSlottedContext(TextContext, "errorMessage");
	return (
		<Field
			{...props}
			labelElementType={Label}
			descriptionProps={descriptionProps ?? undefined}
			errorMessageProps={errorMessageProps ?? undefined}
			showErrorIcon={false}
		/>
	);
}
