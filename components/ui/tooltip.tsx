"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { Fragment, type ReactNode } from "react";
import {
	composeRenderProps,
	OverlayArrow as AriaOverlayArrow,
	Tooltip as AriaTooltip,
	type TooltipProps as AriaTooltipProps,
	TooltipTrigger as AriaTooltipTrigger,
} from "react-aria-components";

export { AriaTooltipTrigger as TooltipTrigger };

interface TooltipProps extends AriaTooltipProps {}

export function Tooltip(props: Readonly<TooltipProps>): ReactNode {
	const { children, className, ...rest } = props;

	return (
		<AriaTooltip
			offset={10}
			{...rest}
			className={composeRenderProps(className, (className) => {
				return cn(
					"group rounded-md border border-neutral-800 bg-neutral-700 px-3 py-1 text-sm text-neutral-0 drop-shadow-lg will-change-transform entering:placement-left:animate-popover-left-in entering:placement-right:animate-popover-right-in entering:placement-top:animate-popover-top-in entering:placement-bottom:animate-popover-bottom-in exiting:placement-left:animate-popover-left-out exiting:placement-right:animate-popover-right-out exiting:placement-top:animate-popover-top-out exiting:placement-bottom:animate-popover-bottom-out",
					className,
				);
			})}
		>
			{composeRenderProps(children, (children) => {
				return (
					<Fragment>
						<AriaOverlayArrow>
							<svg
								className="fill-neutral-700 stroke-neutral-800 group-placement-left:-rotate-90 group-placement-right:rotate-90 group-placement-bottom:rotate-180 forced-colors:fill-[Canvas] forced-colors:stroke-[ButtonBorder]"
								height={8}
								viewBox="0 0 8 8"
								width={8}
							>
								<path d="M0 0 L4 4 L8 0" />
							</svg>
						</AriaOverlayArrow>
						{children}
					</Fragment>
				);
			})}
		</AriaTooltip>
	);
}
