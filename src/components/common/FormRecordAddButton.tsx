import type { ForwardedRef } from "react";
import { forwardRef } from "react";

import type { FormButtonLinkProps } from "@/lib/core/form/FormButtonLink";
import { FormButtonLink } from "@/lib/core/form/FormButtonLink";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import PlusIcon from "@/lib/core/ui/icons/plus.svg?symbol-icon";

export type FormRecordAddButtonProps = FormButtonLinkProps;

export const FormRecordAddButton = forwardRef(function FormRecordAddButton(
	props: FormRecordAddButtonProps,
	forwardeRef: ForwardedRef<HTMLButtonElement>,
): JSX.Element {
	const { children } = props;

	return (
		<FormButtonLink ref={forwardeRef} {...props}>
			<Icon icon={PlusIcon} />
			{children}
		</FormButtonLink>
	);
});
