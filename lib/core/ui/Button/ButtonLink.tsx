import { cn } from "@acdh-oeaw/style-variants";
import { type ForwardedRef, forwardRef, type ReactNode } from "react";
import {
	Button as AriaButton,
	type ButtonProps as AriaButtonProps,
	composeRenderProps,
} from "react-aria-components";

export interface ButtonLinkProps extends AriaButtonProps {}

export const ButtonLink = forwardRef(function ButtonLink(
	props: ButtonLinkProps,
	forwardedRef: ForwardedRef<HTMLButtonElement>,
): ReactNode {
	const { children, className, ...rest } = props;

	return (
		<AriaButton
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className) => {
				return cn(
					"inline-flex items-center gap-1.5 text-primary-750 outline-transparent transition hover:text-primary-600 focus-visible:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:text-neutral-600 pressed:hover:text-primary-500",
					className,
				);
			})}
		>
			{children}
		</AriaButton>
	);
});
