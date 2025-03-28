"use client";

import { type GetVariantProps, styles } from "@acdh-oeaw/style-variants";
import { Loader2Icon } from "lucide-react";
import { type ComponentPropsWithRef, Fragment, type ReactNode } from "react";
import {
	Button as AriaButton,
	type ButtonProps as AriaButtonProps,
	composeRenderProps,
} from "react-aria-components";

import { Link } from "@/components/link";
import { NavLink } from "@/components/nav-link";

const buttonStyles = styles({
	base: "*:data-[slot=icon]:first-child:-ml-1 *:data-[slot=icon]:last-child:-mr-1 isolate inline-flex items-center justify-center gap-x-2 text-center transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed *:data-[slot=icon]:shrink-0 forced-colors:disabled:text-[GrayText] pending:opacity-75",
	variants: {
		kind: {
			primary: "bg-brand-750 text-neutral-0 hover:bg-brand-600 disabled:bg-neutral-200",
			sceondary: "bg-brand-600 text-neutral-0 disabled:bg-neutral-200",
			gradient:
				"bg-gradient-to-r from-brand-500 to-brand-800 text-neutral-0 disabled:bg-neutral-200",
			text: "text-brand-750 hover:text-brand-700 disabled:text-neutral-500",
		},
		size: {
			small: "min-h-9 rounded-sm px-4 text-[0.9375rem] font-medium",
			medium: "min-h-12 rounded-sm px-4 text-[0.9375rem] font-medium",
		},
		variant: {
			default: "",
			"icon-only": "",
		},
	},
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
			{composeRenderProps(children, (children) => {
				return (
					<Fragment>
						{props.isPending ? (
							<Loader2Icon aria-hidden={true} className="animate-spin" data-slot="icon" />
						) : null}
						{children}
					</Fragment>
				);
			})}
		</AriaButton>
	);
}

interface ButtonLinkProps extends ComponentPropsWithRef<typeof Link>, ButtonStyleProps {}

export function ButtonLink(props: ButtonLinkProps): ReactNode {
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

export function ButtonNavLink(props: ButtonNavLinkProps): ReactNode {
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
