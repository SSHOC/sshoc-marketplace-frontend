// Converted from lib/core/ui/icons/link.svg. Keep the original SVG as the source asset.
import type { ReactNode, Ref, SVGProps } from "react";
import { forwardRef } from "react";
interface SVGRProps {
	title?: ReactNode;
	titleId?: string;
}
const SvgLink = (
	{ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
	ref: Ref<SVGSVGElement>,
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 9.444 9.444"
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
		<path d="M8.816 4.251 6.888 6.179a2.16 2.16 0 0 1-3.045 0l-.27-.27-.039-.039-.039-.039a.484.484 0 0 1 0-.683l.078-.078a.484.484 0 0 1 .683 0l.039.039.039.039.154.154a1.137 1.137 0 0 0 1.6 0l1.851-1.851a1.137 1.137 0 0 0 0-1.6l-.388-.388a1.137 1.137 0 0 0-1.6 0l-.466.466a.26.26 0 0 1-.163.093H3.968c-.169 0-.047-.12-.047-.12L5.195.628a2.16 2.16 0 0 1 3.045 0l.576.576a2.16 2.16 0 0 1 0 3.047M.628 8.24l.576.576a2.16 2.16 0 0 0 3.045 0l1.274-1.274s.122-.12-.047-.12H4.122a.26.26 0 0 0-.163.093l-.466.466a1.137 1.137 0 0 1-1.6 0l-.385-.385a1.137 1.137 0 0 1 0-1.6l1.843-1.852a1.137 1.137 0 0 1 1.6 0l.154.154.039.039.039.039a.484.484 0 0 0 .683 0l.085-.078a.484.484 0 0 0 0-.683l-.039-.039-.039-.039-.27-.27a2.16 2.16 0 0 0-3.045 0L.628 5.195a2.16 2.16 0 0 0 0 3.045" />
	</svg>
);
const ForwardRef = forwardRef(SvgLink);
export default ForwardRef;
