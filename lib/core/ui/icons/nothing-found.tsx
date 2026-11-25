// Converted from public/assets/images/search/nothing-found.svg. Keep the original SVG as the source asset.
import type { ReactNode, Ref, SVGProps } from "react";
import { forwardRef } from "react";
interface SVGRProps {
	title?: ReactNode;
	titleId?: string;
}
const SvgNothingFound = (
	{ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
	ref: Ref<SVGSVGElement>,
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 56 67.923"
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
			fill="#ff9e1a"
			d="M12.494 34.432h5.863a2.106 2.106 0 1 0 0-4.211h-5.863a2.106 2.106 0 1 0 0 4.211"
		/>
		<path
			fill="#0085ca"
			d="M14.599 24.796a2.105 2.105 0 1 0-2.105 2.105 2.105 2.105 0 0 0 2.105-2.105M38.715 24.796a2.11 2.11 0 0 0-2.105-2.105H20.673a2.106 2.106 0 1 0 0 4.211h15.936a2.11 2.11 0 0 0 2.106-2.106"
		/>
		<path
			fill="#02558c"
			d="m48.685 14.511.011-.011-.058-.057a2 2 0 0 0-.084-.084L34.685.479l-.007.007A1.66 1.66 0 0 0 33.508 0H1.658A1.663 1.663 0 0 0 0 1.658v59.169a1.684 1.684 0 0 0 1.679 1.68h20.054a2.254 2.254 0 0 0 2.24-2.253 2.2 2.2 0 0 0-.329-1.1 2.23 2.23 0 0 0-1.926-1.152H4.511V4.511l26.685.006v11.827a1.307 1.307 0 0 0 1.3 1.3h12.095v13.611a2.256 2.256 0 1 0 4.511 0V15.577a1.65 1.65 0 0 0-.417-1.066m-13.21-.732V8.115l5.793 5.664Z"
		/>
		<path
			fill="#02558c"
			d="m55.08 62.545-7.816-7.816a3 3 0 0 0-.534-.354 13.819 13.819 0 1 0-4.351 4.164 3 3 0 0 0 .427.646l7.816 7.816a3.152 3.152 0 0 0 4.458-4.458Zm-29.2-15.558a9.511 9.511 0 1 1 9.511 9.511 9.51 9.51 0 0 1-9.507-9.511Z"
		/>
	</svg>
);
const ForwardRef = forwardRef(SvgNothingFound);
export default ForwardRef;
