// Converted from public/assets/images/account/contributed-items.svg. Keep the original SVG as the source asset.
import type { ReactNode, Ref, SVGProps } from "react";
import { forwardRef } from "react";
interface SVGRProps {
	title?: ReactNode;
	titleId?: string;
}
const SvgAccountContributedItems = (
	{ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
	ref: Ref<SVGSVGElement>,
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 43.565 52.289"
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
		<path d="M41.406 39.8h-6.012v-6.012a2.159 2.159 0 1 0-4.318 0V39.8h-6.013a2.159 2.159 0 1 0 0 4.318h6.012v6.009a2.159 2.159 0 1 0 4.318 0v-6.009h6.012a2.159 2.159 0 1 0 0-4.318zM27.724 23.43h-16.69a1.407 1.407 0 0 1-1.4-1.4 1.407 1.407 0 0 1 1.4-1.4h16.69a1.407 1.407 0 0 1 1.4 1.4 1.407 1.407 0 0 1-1.4 1.4m0 6.593h-16.69a1.407 1.407 0 0 1-1.404-1.4 1.407 1.407 0 0 1 1.4-1.4h16.69a1.407 1.407 0 0 1 1.4 1.4 1.407 1.407 0 0 1-1.396 1.4M17.43 36.617h-6.5a1.407 1.407 0 0 1-1.4-1.4 1.407 1.407 0 0 1 1.4-1.4h6.5a1.407 1.407 0 0 1 1.4 1.4 1.407 1.407 0 0 1-1.4 1.4" />
		<path d="m37.35 11.132.009-.009-.044-.044a1 1 0 0 0-.065-.065L26.603.368l-.005.005a1.27 1.27 0 0 0-.9-.373H1.272A1.276 1.276 0 0 0-.002 1.272v45.393a1.29 1.29 0 0 0 1.29 1.288h15.384a1.73 1.73 0 0 0 1.718-1.73 1.7 1.7 0 0 0-.252-.846 1.71 1.71 0 0 0-1.478-.884H3.46V3.46h20.471v9.073a1 1 0 0 0 1 1h9.276v10.443a1.73 1.73 0 1 0 3.46 0V11.95a1.27 1.27 0 0 0-.317-.818m-10.138-.561V6.223l4.444 4.345z" />
	</svg>
);
const ForwardRef = forwardRef(SvgAccountContributedItems);
export default ForwardRef;
