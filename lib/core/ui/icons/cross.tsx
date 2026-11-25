// Converted from lib/core/ui/icons/cross.svg. Keep the original SVG as the source asset.
import type { ReactNode, Ref, SVGProps } from "react";
import { forwardRef } from "react";
interface SVGRProps {
	title?: ReactNode;
	titleId?: string;
}
const SvgCross = (
	{ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
	ref: Ref<SVGSVGElement>,
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 8 8"
		width="1em"
		height="1em"
		role="img"
		focusable={false}
		data-icon={true}
		ref={ref}
		aria-labelledby={titleId}
		{...props}
	>
		{title != null ? <title id={titleId}>{title}</title> : null}
		<path d="m5.238 4 2.456-2.456A.875.875 0 0 0 6.457.306L4 2.762 1.543.306A.875.875 0 0 0 .306 1.544L2.762 4 .306 6.456a.875.875 0 0 0 1.237 1.238L4 5.238l2.457 2.456a.875.875 0 1 0 1.237-1.238Z" />
	</svg>
);
const ForwardRef = forwardRef(SvgCross);
export default ForwardRef;
