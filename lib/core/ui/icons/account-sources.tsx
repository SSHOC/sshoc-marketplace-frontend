// Converted from public/assets/images/account/sources.svg. Keep the original SVG as the source asset.
import type { ReactNode, Ref, SVGProps } from "react";
import { forwardRef } from "react";
interface SVGRProps {
	title?: ReactNode;
	titleId?: string;
}
const SvgAccountSources = (
	{ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
	ref: Ref<SVGSVGElement>,
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 40.811 50.629"
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
		<path d="M23.551 32.73c0-1.735 3.864-3.142 8.63-3.142s8.63 1.407 8.63 3.142-3.864 3.145-8.63 3.145-8.63-1.409-8.63-3.145m8.63 4.458c-4.587 0-8.354-1.142-8.63-2.787v3.3c0 1.735 3.864 3.142 8.63 3.142s8.63-1.407 8.63-3.142v-3.3c-.276 1.645-4.043 2.787-8.63 2.787m0 4.934c-4.587 0-8.354-1.142-8.63-2.787v3.3c0 1.735 3.864 3.142 8.63 3.142s8.63-1.407 8.63-3.142v-3.3c-.276 1.645-4.043 2.787-8.63 2.787m0 4.849c-4.587 0-8.354-1.142-8.63-2.787v3.3c0 1.735 3.864 3.142 8.63 3.142s8.63-1.407 8.63-3.142v-3.3c-.276 1.645-4.043 2.791-8.63 2.791z" />
		<path d="m35.388 10.547.008-.008-.042-.041q-.03-.032-.061-.061L25.207.348a1.2 1.2 0 0 0-.85-.353H1.205A1.21 1.21 0 0 0 0 1.21v43.004a1.224 1.224 0 0 0 1.22 1.221h14.579a1.64 1.64 0 0 0 1.628-1.637 1.6 1.6 0 0 0-.239-.8 1.62 1.62 0 0 0-1.4-.837H3.279V3.279h19.4v8.6a.95.95 0 0 0 .947.947h8.789v9.891a1.64 1.64 0 1 0 3.279 0v-11.4a1.2 1.2 0 0 0-.306-.77m-9.6-.532V5.899l4.211 4.117z" />
		<path d="M25.849 21.2H10.035a1.334 1.334 0 0 1-1.33-1.33 1.334 1.334 0 0 1 1.33-1.33h15.814a1.334 1.334 0 0 1 1.33 1.33 1.334 1.334 0 0 1-1.33 1.33m0 6.245H10.035a1.334 1.334 0 0 1-1.33-1.33 1.334 1.334 0 0 1 1.33-1.33h15.814a1.334 1.334 0 0 1 1.33 1.33 1.334 1.334 0 0 1-1.33 1.33m-9.754 6.246H9.938a1.334 1.334 0 0 1-1.33-1.33 1.334 1.334 0 0 1 1.33-1.33h6.157a1.334 1.334 0 0 1 1.33 1.33 1.334 1.334 0 0 1-1.33 1.33" />
	</svg>
);
const ForwardRef = forwardRef(SvgAccountSources);
export default ForwardRef;
