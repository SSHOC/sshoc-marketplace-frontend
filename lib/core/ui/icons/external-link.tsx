// Converted from lib/core/ui/icons/external-link.svg. Keep the original SVG as the source asset.
import type { ReactNode, Ref, SVGProps } from "react";
import { forwardRef } from "react";
interface SVGRProps {
	title?: ReactNode;
	titleId?: string;
}
const SvgExternalLink = (
	{ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
	ref: Ref<SVGSVGElement>,
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 8.985 8.985"
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
		<path d="M6.418 5.134h.642v3.851H0v-7.06h3.851v.642H.642v5.776h5.776zM3.851 0l.8.8h3.081L3.005 5.526l.454.454 4.7-4.7v3.031l.823.823V0z" />
	</svg>
);
const ForwardRef = forwardRef(SvgExternalLink);
export default ForwardRef;
