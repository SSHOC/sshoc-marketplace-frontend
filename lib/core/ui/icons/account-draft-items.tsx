// Converted from public/assets/images/account/draft-items.svg. Keep the original SVG as the source asset.
import type { ReactNode, Ref, SVGProps } from "react";
import { forwardRef } from "react";
interface SVGRProps {
	title?: ReactNode;
	titleId?: string;
}
const SvgAccountDraftItems = (
	{ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
	ref: Ref<SVGSVGElement>,
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 45.739 52.668"
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
		<path d="m37.745 11.249.009-.009-.045-.044a1 1 0 0 0-.065-.065L26.884.371l-.005.005a1.28 1.28 0 0 0-.907-.377H1.285A1.29 1.29 0 0 0-.001 1.285v45.872a1.306 1.306 0 0 0 1.3 1.3h15.549a1.747 1.747 0 0 0 1.737-1.746 1.7 1.7 0 0 0-.255-.855 1.73 1.73 0 0 0-1.493-.893H3.499V3.497h20.687v9.173a1.013 1.013 0 0 0 1.01 1.01h9.374v10.55a1.75 1.75 0 1 0 3.5 0V12.076a1.28 1.28 0 0 0-.325-.827m-10.246-.567V6.291l4.491 4.391z" />
		<path d="M27.569 22.614H10.703a1.42 1.42 0 0 1-1.416-1.422 1.42 1.42 0 0 1 1.418-1.418h16.864a1.42 1.42 0 0 1 1.418 1.418 1.42 1.42 0 0 1-1.418 1.422m0 6.657H10.703a1.42 1.42 0 0 1-1.416-1.418 1.42 1.42 0 0 1 1.418-1.418h16.864a1.42 1.42 0 0 1 1.418 1.418 1.42 1.42 0 0 1-1.418 1.418m-10.402 6.662h-6.568a1.42 1.42 0 0 1-1.418-1.418 1.42 1.42 0 0 1 1.418-1.418h6.567a1.42 1.42 0 0 1 1.418 1.418 1.42 1.42 0 0 1-1.417 1.418m18.07.763v3.922a1.16 1.16 0 0 1-.512.944c-.027.023-.044.054-.074.074l-5.39 3.562a.982.982 0 0 1-1.083-1.638l4.7-3.109v-3.755a1.177 1.177 0 0 1 2.355 0zm10.5 4.338a11.634 11.634 0 1 1-11.632-11.633 11.634 11.634 0 0 1 11.634 11.633zm-3.069 0a8.59 8.59 0 0 0-8.565-8.565 8.565 8.565 0 1 0 0 17.13 8.59 8.59 0 0 0 8.567-8.565z" />
	</svg>
);
const ForwardRef = forwardRef(SvgAccountDraftItems);
export default ForwardRef;
