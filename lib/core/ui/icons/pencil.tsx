// Converted from lib/core/ui/icons/pencil.svg. Keep the original SVG as the source asset.
import type { ReactNode, Ref, SVGProps } from "react";
import { forwardRef } from "react";
interface SVGRProps {
	title?: ReactNode;
	titleId?: string;
}
const SvgPencil = (
	{ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
	ref: Ref<SVGSVGElement>,
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
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
		<path
			d="M16.784 4.1 13.9 1.216a.6.6 0 0 0-.433-.176h-.017a.69.69 0 0 0-.463.203L2.541 11.686a.5.5 0 0 0-.125.211l-1.39 4.653c-.056.189.23.426.392.426l.031-.004c.138-.031 3.933-1.172 4.656-1.389a.5.5 0 0 0 .207-.124L16.757 5.014a.7.7 0 0 0 .2-.441.6.6 0 0 0-.174-.473M5.7 14.658c-1.08.325-2.431.733-3.365 1.011l1.005-3.365Z"
			className="pencil_svg__a"
		/>
	</svg>
);
const ForwardRef = forwardRef(SvgPencil);
export default ForwardRef;
