"use client";

import { type GetVariantProps, styles } from "@acdh-oeaw/style-variants";
import { type ComponentPropsWithRef, Fragment, type ReactNode } from "react";
import {
	Button as AriaButton,
	type ButtonProps as AriaButtonProps,
	composeRenderProps,
} from "react-aria-components";

import { Link } from "@/components/link";
import { NavLink } from "@/components/nav-link";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

const buttonStyles = styles({
	base: "*:data-[slot=icon]:first-child:-ml-1 *:data-[slot=icon]:last-child:-mr-1 relative isolate inline-flex items-center justify-center gap-x-2 text-center outline-transparent transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed *:data-[slot=icon]:shrink-0 forced-colors:disabled:text-[GrayText] pending:cursor-not-allowed",
	variants: {
		kind: {
			primary: "bg-brand-750 text-neutral-0 hover:bg-brand-600 disabled:bg-neutral-200",
			sceondary: "bg-brand-600 text-neutral-0 disabled:bg-neutral-200",
			gradient:
				"bg-gradient-to-r from-brand-500 to-brand-800 bg-[length:125%] bg-left text-neutral-0 transition-all hover:bg-right disabled:bg-neutral-200",
			text: "text-brand-750 hover:text-brand-600 disabled:text-neutral-500",
		},
		size: {
			small: "rounded-sm px-4 text-sm font-medium",
			medium: "rounded-sm px-4 text-base font-medium",
		},
		variant: {
			default: "",
			"icon-only": "",
		},
	},
	combinations: [
		[{ size: "small", variant: "default" }, "min-h-8 px-3 py-1 *:data-[slot=icon]:size-4"],
		[{ size: "medium", variant: "default" }, "min-h-12 px-10 py-2.5 *:data-[slot=icon]:size-5"],

		[{ size: "small", variant: "icon-only" }, "size-8 *:data-[slot=icon]:size-4"],
		[{ size: "medium", variant: "icon-only" }, "size-12 *:data-[slot=icon]:size-6"],
	],
	defaults: {
		kind: "primary",
		size: "medium",
		variant: "default",
	},
});

type ButtonStyleProps = GetVariantProps<typeof buttonStyles>;

interface ButtonProps extends AriaButtonProps, ButtonStyleProps {}

export function Button(props: Readonly<ButtonProps>): ReactNode {
	const { children, className, kind, size, variant, ...rest } = props;

	return (
		<AriaButton
			{...rest}
			className={composeRenderProps(className, (className) => {
				return buttonStyles({ className, kind, size, variant });
			})}
		>
			{composeRenderProps(children, (children, renderProps) => {
				const { isPending } = renderProps;

				return (
					<Fragment>
						{isPending ? (
							<LoadingIndicator aria-hidden={true} data-slot="icon" delay="none" />
						) : null}
						{children}
					</Fragment>
				);
			})}
		</AriaButton>
	);
}

interface ButtonLinkProps extends ComponentPropsWithRef<typeof Link>, ButtonStyleProps {}

export function ButtonLink(props: Readonly<ButtonLinkProps>): ReactNode {
	const { children, className, kind, size, variant, ...rest } = props;

	return (
		<Link
			{...rest}
			className={composeRenderProps(className, (className) => {
				return buttonStyles({ className, kind, size, variant });
			})}
		>
			{children}
		</Link>
	);
}

interface ButtonNavLinkProps extends ComponentPropsWithRef<typeof NavLink>, ButtonStyleProps {}

export function ButtonNavLink(props: Readonly<ButtonNavLinkProps>): ReactNode {
	const { children, className, kind, size, variant, ...rest } = props;

	return (
		<NavLink
			{...rest}
			className={composeRenderProps(className, (className) => {
				return buttonStyles({ className, kind, size, variant });
			})}
		>
			{children}
		</NavLink>
	);
}
