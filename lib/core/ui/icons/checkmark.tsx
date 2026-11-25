// Converted from lib/core/ui/icons/checkmark.svg. Keep the original SVG as the source asset.
import type { ReactNode, Ref, SVGProps } from "react";
import { forwardRef } from "react";
interface SVGRProps {
	title?: ReactNode;
	titleId?: string;
}
const SvgCheckmark = (
	{ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
	ref: Ref<SVGSVGElement>,
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 18 18"
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
		<path d="M17.322 1.276a1.225 1.225 0 0 0-1.722.206L6.269 13.358 2.365 8.674a1.227 1.227 0 1 0-1.885 1.57l4.874 5.848c.026.031.064.043.092.07a1 1 0 0 0 .093.11 1 1 0 0 0 .17.092 1 1 0 0 0 .128.07 1.2 1.2 0 0 0 .459.1H6.3a1.2 1.2 0 0 0 .36-.063q.043-.013.084-.028a1.2 1.2 0 0 0 .33-.189l.008-.004c.007-.006.009-.014.015-.02a1.2 1.2 0 0 0 .165-.165L17.529 2.998a1.227 1.227 0 0 0-.207-1.722" />
	</svg>
);
const ForwardRef = forwardRef(SvgCheckmark);
export default ForwardRef;
