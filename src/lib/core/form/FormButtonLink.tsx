import type { ForwardedRef } from "react";
import { forwardRef } from "react";
import { useFormState } from "react-final-form";

import type { ButtonLinkProps } from "@/lib/core/ui/Button/ButtonLink";
import { ButtonLink } from "@/lib/core/ui/Button/ButtonLink";

export type FormButtonLinkProps = Pick<
	ButtonLinkProps,
	"children" | "form" | "isDisabled" | "onPress" | "type"
>;

export const FormButtonLink = forwardRef(function FormButtonLink(
	props: FormButtonLinkProps,
	forwardeRef: ForwardedRef<HTMLButtonElement>,
): JSX.Element {
	const { children, isDisabled } = props;

	const form = useFormState();

	return (
		<ButtonLink ref={forwardeRef} {...props} isDisabled={form.submitting || isDisabled}>
			{children}
		</ButtonLink>
	);
});
