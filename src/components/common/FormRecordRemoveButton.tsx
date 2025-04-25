import type { ForwardedRef } from "react";
import { forwardRef } from "react";

import type { FormButtonLinkProps } from "@/lib/core/form/FormButtonLink";
import { FormButtonLink } from "@/lib/core/form/FormButtonLink";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import CrossIcon from "@/lib/core/ui/icons/cross.svg?symbol-icon";

export type FormRecordRemoveButtonProps = FormButtonLinkProps;

export const FormRecordRemoveButton = forwardRef(function FormRecordRemoveButton(
	props: FormRecordRemoveButtonProps,
	forwardeRef: ForwardedRef<HTMLButtonElement>,
): JSX.Element {
	const { children } = props;

	return (
		<FormButtonLink ref={forwardeRef} {...props}>
			<Icon icon={CrossIcon} />
			{children}
		</FormButtonLink>
	);
});
