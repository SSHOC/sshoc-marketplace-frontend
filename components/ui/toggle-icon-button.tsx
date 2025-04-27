"use client";

import { type ComponentPropsWithRef, Fragment, type ReactNode } from "react";
import { composeRenderProps } from "react-aria-components";

import { ToggleButton } from "@/components/ui/toggle-button";

interface ToggleIconButtonProps
	extends Omit<ComponentPropsWithRef<typeof ToggleButton>, "variant"> {
	label: ReactNode;
}

export function ToggleIconButton(props: Readonly<ToggleIconButtonProps>): ReactNode {
	const { children, label, ...rest } = props;

	return (
		<ToggleButton {...rest} variant="icon-only">
			{composeRenderProps(children, (children) => {
				return (
					<Fragment>
						{children}
						<span className="sr-only">{label}</span>
					</Fragment>
				);
			})}
		</ToggleButton>
	);
}
