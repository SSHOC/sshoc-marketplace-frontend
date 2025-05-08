import { type GetVariantProps, styles } from "@acdh-oeaw/style-variants";
import Link, { type LinkProps } from "next/link";
import {
	type ComponentPropsWithoutRef,
	type ForwardedRef,
	forwardRef,
	type ReactNode,
} from "react";
import {
	Button as AriaButton,
	type ButtonProps as AriaButtonProps,
	composeRenderProps,
} from "react-aria-components";

const buttonStyles = styles({
	base: "inline-flex items-center justify-center gap-x-2 rounded-sm border font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:bg-neutral-200 disabled:text-neutral-600",
	variants: {
		color: {
			primary:
				"bg-primary-750 text-neutral-0 hover:bg-primary-600 focus-visible:bg-primary-600 pressed:bg-primary-500",
			secondary:
				"bg-primary-600 text-neutral-0 hover:bg-primary-500 focus-visible:bg-primary-500 pressed:bg-primary-750",
			gradient:
				"bg-gradient-to-r from-primary-500 to-primary-800 bg-size-[125%] bg-left text-neutral-0 transition-all hover:bg-right focus-visible:bg-right disabled:bg-none pressed:bg-right",
			negative:
				"bg-negative-600 text-neutral-0 hover:bg-negative-500 focus-visible:bg-negative-500 pressed:bg-negative-750",
			positive:
				"pressed:bg-positive-750 bg-positive-600 text-neutral-0 hover:bg-positive-500 focus-visible:bg-positive-500",
			"review-negative":
				"border-neutral-250 bg-neutral-0 text-primary-750 hover:border-negative-200 hover:bg-negative-100 hover:text-neutral-800 focus-visible:border-negative-200 focus-visible:bg-negative-100 focus-visible:text-neutral-800 pressed:border-negative-200 pressed:bg-negative-100 pressed:text-neutral-800",
			"review-positive":
				"border-neutral-250 bg-neutral-0 text-primary-750 hover:border-positive-400 hover:bg-positive-100 hover:text-neutral-800 focus-visible:border-positive-400 focus-visible:bg-positive-100 focus-visible:text-neutral-800 pressed:border-positive-400 pressed:bg-positive-100 pressed:text-neutral-800",
		},
		size: {
			lg: "px-12 py-3.5 text-lg leading-6",
			md: "px-10 py-3 text-md leading-5.5",
			sm: "px-8 py-2 text-sm leading-4",
			xs: "px-4 py-1.5 text-xs leading-4",
		},
	},
	defaults: {
		color: "primary",
		size: "md",
	},
});

type ButtonStyleProps = GetVariantProps<typeof buttonStyles>;

export interface ButtonProps extends AriaButtonProps, ButtonStyleProps {}

export const Button = forwardRef(function Button(
	props: Readonly<ButtonProps>,
	forwardedRef: ForwardedRef<HTMLButtonElement>,
): ReactNode {
	const { children, className, color, size, ...rest } = props;

	return (
		<AriaButton
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className) =>
				buttonStyles({ className, color, size }),
			)}
		>
			{children}
		</AriaButton>
	);
});

//

interface LinkButtonProps
	extends Omit<LinkProps, "as" | "href" | "locale" | "passHref">,
		Pick<
			ComponentPropsWithoutRef<"a">,
			"aria-current" | "children" | "className" | "id" | "rel" | "target"
		>,
		ButtonStyleProps {
	href: string;
}

export const LinkButton = forwardRef(function LinkButton(
	props: Readonly<LinkButtonProps>,
	forwardedRef: ForwardedRef<HTMLAnchorElement>,
) {
	const { children, className, color, size, ...rest } = props;

	// TODO: "cursor-pointer"
	return (
		<Link ref={forwardedRef} {...rest} className={buttonStyles({ className, color, size })}>
			{children}
		</Link>
	);
});
