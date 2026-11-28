import { forwardRef, type ForwardedRef, type ReactNode } from "react";

import { TextField, type TextFieldProps } from "@/lib/core/ui/TextField/TextField";

export type DateFieldProps = Omit<TextFieldProps, "type">;

export const DateField = forwardRef(function DateField(
	props: DateFieldProps,
	ref: ForwardedRef<HTMLDivElement>,
): ReactNode {
	return <TextField {...props} ref={ref} type="date" />;
});
