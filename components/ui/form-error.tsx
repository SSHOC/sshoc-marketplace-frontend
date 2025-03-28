import { cn } from "@acdh-oeaw/style-variants";
import { OctagonXIcon } from "lucide-react";
import { type ComponentPropsWithRef, Fragment, type ReactNode } from "react";

import { FormErrorMessage } from "@/components/form-error-message";

interface FormErrorProps extends ComponentPropsWithRef<typeof FormErrorMessage> {}

export function FormError(props: Readonly<FormErrorProps>): ReactNode {
	const { className, ...rest } = props;

	return (
		<FormErrorMessage
			{...rest}
			className={cn(
				"flex min-h-12 items-center gap-x-2 rounded-sm border border-negative-600 bg-negative-100 px-4 py-2.5 text-sm font-medium text-negative-600",
				className,
			)}
		>
			{(state) => {
				return (
					<Fragment>
						<OctagonXIcon
							aria-hidden={true}
							className="text-icon-error size-6 shrink-0 self-start"
							data-slot="icon"
						/>
						{state.message}
					</Fragment>
				);
			}}
		</FormErrorMessage>
	);
}
