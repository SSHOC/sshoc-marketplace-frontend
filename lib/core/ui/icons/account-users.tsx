// Converted from public/assets/images/account/users.svg. Keep the original SVG as the source asset.
import type { ReactNode, Ref, SVGProps } from "react";
import { forwardRef } from "react";
interface SVGRProps {
	title?: ReactNode;
	titleId?: string;
}
const SvgAccountUsers = (
	{ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
	ref: Ref<SVGSVGElement>,
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 54.475 39.844"
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
		<path d="M36.524 29.148c0-1.784.376-1.724-.614-2.793a6.4 6.4 0 0 1-1.307-2.775 4.6 4.6 0 0 0-.343-1.234l-.024-.016a8 8 0 0 0-.363-.653 4.7 4.7 0 0 1-.6-2.02c0-.437-.157-1.149.438-1.188a10 10 0 0 1-.12-3.845c.4-1.625 1.067-4.6 6.422-4.875h.012c5.354.277 6.026 3.25 6.422 4.875a10 10 0 0 1-.12 3.845c.6.039.438.752.438 1.188a4.7 4.7 0 0 1-.595 2.02c-.161.274-.27.458-.363.653l-.024.016a4.6 4.6 0 0 0-.343 1.234 6.4 6.4 0 0 1-1.307 2.775c-.99 1.069-.614 1.009-.614 2.793s1.486 2.139 4.459 3.15a37 37 0 0 1 5.652 2.533 2.23 2.23 0 0 1 .809 2.048c-.007.21.026.411.03.608h.001v2.357h-12.1v-4.533c.043-3.3-3.473-4.895-3.473-4.895l-2.4-1.09c.011-.06.027-.115.027-.178m.375 4.719a43.3 43.3 0 0 0-6.952-3.044c-4.064-1.382-6.1-1.867-6.1-4.307s-.514-2.357.839-3.818a8.77 8.77 0 0 0 1.787-3.795 5.6 5.6 0 0 1 .977-2.6 6.46 6.46 0 0 0 .811-2.762c0-.6.215-1.571-.594-1.625a13.7 13.7 0 0 0 .159-5.257C27.298 4.448 26.378.406 19.147 0c-7.235.406-8.155 4.445-8.691 6.657a13.7 13.7 0 0 0 .159 5.257c-.809.054-.594 1.028-.594 1.625a6.46 6.46 0 0 0 .811 2.762 5.6 5.6 0 0 1 .977 2.6 8.77 8.77 0 0 0 1.787 3.795c1.354 1.461.839 1.379.839 3.818s-2.032 2.925-6.1 4.307a43.3 43.3 0 0 0-6.949 3.044 3.02 3.02 0 0 0-1.387 2.516v3.467h38.287v-3.465a3.02 3.02 0 0 0-1.387-2.516" />
	</svg>
);
const ForwardRef = forwardRef(SvgAccountUsers);
export default ForwardRef;
