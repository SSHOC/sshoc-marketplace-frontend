// Converted from lib/core/ui/icons/chevron.svg. Keep the original SVG as the source asset.
import type { ReactNode, Ref, SVGProps } from "react";
import { forwardRef } from "react";
interface SVGRProps {
	title?: ReactNode;
	titleId?: string;
}
const SvgChevron = (
	{ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
	ref: Ref<SVGSVGElement>,
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 12 12"
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
		<path d="M9.034 5.355 4.343.664a.912.912 0 0 0-1.29 1.289L7.102 6l-4.047 4.047a.912.912 0 1 0 1.289 1.29l4.691-4.692a.91.91 0 0 0 0-1.29" />
	</svg>
);
const ForwardRef = forwardRef(SvgChevron);
export default ForwardRef;
