import { cn } from "@acdh-oeaw/style-variants";
import { CheckCircle2Icon } from "lucide-react";
import { type ComponentPropsWithRef, Fragment, type ReactNode } from "react";

import { FormSuccessMessage } from "@/components/form-success-message";

interface FormSuccessProps extends ComponentPropsWithRef<typeof FormSuccessMessage> {}

export function FormSuccess(props: Readonly<FormSuccessProps>): ReactNode {
	const { className, ...rest } = props;

	return (
		<FormSuccessMessage
			{...rest}
			className={cn(
				"rounded-2 border-stroke-success-weak bg-fill-success-weak text-small font-strong text-text-success flex min-h-12 items-center gap-x-2 border px-4 py-2.5",
				className,
			)}
		>
			{(state) => {
				return (
					<Fragment>
						<CheckCircle2Icon
							aria-hidden={true}
							className="text-icon-success size-6 shrink-0 self-start"
							data-slot="icon"
						/>
						{state.message}
					</Fragment>
				);
			}}
		</FormSuccessMessage>
	);
}
