import type { ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import { useFormState } from "react-final-form";

import type { ButtonProps } from "@/lib/core/ui/Button/Button";
import { Button } from "@/lib/core/ui/Button/Button";

export type FormButtonProps = Pick<
	ButtonProps,
	"children" | "form" | "isDisabled" | "onPress" | "type" | "variant"
>;

export const FormButton = forwardRef(function FormButton(
	props: FormButtonProps,
	forwardedRef: ForwardedRef<HTMLButtonElement>,
): ReactNode {
	const { children, isDisabled } = props;

	const form = useFormState();

	return (
		<Button ref={forwardedRef} {...props} isDisabled={form.submitting || isDisabled}>
			{children}
		</Button>
	);
});
