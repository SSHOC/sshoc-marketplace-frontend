import { useContext } from "react";
import { Label, TextContext } from "react-aria-components";

import { Field, type FieldProps } from "@/lib/core/ui/Field/Field";

/** Connect RAC's accessible slots to the shared field presentation. */
export function AriaField(props: FieldProps) {
	const textContext = useContext(TextContext);
	// Some controls only provide a description slot.
	const slots = textContext && "slots" in textContext ? textContext.slots : undefined;
	return (
		<Field
			{...props}
			labelElementType={Label}
			descriptionProps={slots?.["description"] ?? undefined}
			errorMessageProps={slots?.["errorMessage"] ?? undefined}
			showErrorIcon={false}
		/>
	);
}
