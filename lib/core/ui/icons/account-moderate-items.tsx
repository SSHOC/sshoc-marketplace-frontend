// Converted from public/assets/images/account/moderate-items.svg. Keep the original SVG as the source asset.
import type { ReactNode, Ref, SVGProps } from "react";
import { forwardRef } from "react";
interface SVGRProps {
	title?: ReactNode;
	titleId?: string;
}
const SvgAccountModerateItems = (
	{ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
	ref: Ref<SVGSVGElement>,
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 45.5 50.051"
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
		<path d="M27.509 22.922H10.616a1.425 1.425 0 0 1-1.42-1.42 1.425 1.425 0 0 1 1.42-1.42h16.893a1.425 1.425 0 0 1 1.42 1.42 1.425 1.425 0 0 1-1.42 1.42m0 6.672H10.616a1.425 1.425 0 0 1-1.42-1.42 1.425 1.425 0 0 1 1.42-1.42h16.893a1.425 1.425 0 0 1 1.42 1.42 1.425 1.425 0 0 1-1.42 1.42m-10.42 6.671h-6.578a1.425 1.425 0 0 1-1.42-1.42 1.425 1.425 0 0 1 1.42-1.42h6.578a1.425 1.425 0 0 1 1.42 1.42 1.425 1.425 0 0 1-1.42 1.42m27.423-5.066a2.37 2.37 0 0 0-3.3.55l-8.952 12.54-5.826-4.742a2.362 2.362 0 1 0-2.971 3.674l6.168 5.013 1.467 1.158.154.121c.024.019.054.023.079.041s.024.032.042.045a.6.6 0 0 0 .154.069 3.2 3.2 0 0 0 .571.254c.023.008.044.024.068.03h.024a1.4 1.4 0 0 0 .867.047 2.28 2.28 0 0 0 1.426-.763.5.5 0 0 0 .093-.077.2.2 0 0 0 .02-.038c.024-.03.05-.043.073-.075l10.393-14.552a2.37 2.37 0 0 0-.55-3.295" />
		<path d="m37.804 11.267.009-.009-.045-.044-.065-.066L26.927.372l-.005.005A1.29 1.29 0 0 0 26.014 0H1.287A1.29 1.29 0 0 0-.001 1.287v45.944a1.31 1.31 0 0 0 1.3 1.3h15.576a1.75 1.75 0 0 0 1.739-1.749 1.7 1.7 0 0 0-.255-.856 1.73 1.73 0 0 0-1.5-.895H3.499V3.502h20.719v9.184a1.014 1.014 0 0 0 1.012 1.012h9.389v10.57a1.751 1.751 0 1 0 3.5 0V12.095a1.28 1.28 0 0 0-.315-.828m-10.261-.568v-4.4l4.5 4.4z" />
	</svg>
);
const ForwardRef = forwardRef(SvgAccountModerateItems);
export default ForwardRef;
