// Converted from public/assets/images/account/actors.svg. Keep the original SVG as the source asset.
import type { ReactNode, Ref, SVGProps } from "react";
import { forwardRef } from "react";
interface SVGRProps {
	title?: ReactNode;
	titleId?: string;
}
const SvgAccountActors = (
	{ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
	ref: Ref<SVGSVGElement>,
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 44.736 52.968"
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
		<path d="m38.04 11.337.009-.009-.045-.045q-.032-.034-.066-.066L27.095.374l-.005.005a1.3 1.3 0 0 0-.914-.38H1.296a1.3 1.3 0 0 0-1.3 1.3v46.227a1.316 1.316 0 0 0 1.312 1.312H16.98a1.76 1.76 0 0 0 1.75-1.76 1.7 1.7 0 0 0-.257-.862 1.74 1.74 0 0 0-1.5-.9H3.525V3.524h20.849v9.241a1.02 1.02 0 0 0 1.018 1.018h9.447v10.636a1.762 1.762 0 1 0 3.524 0V12.17a1.3 1.3 0 0 0-.323-.833m-10.324-.576V6.34l4.526 4.421z" />
		<path d="M27.786 22.787h-17a1.433 1.433 0 0 1-1.429-1.429 1.433 1.433 0 0 1 1.429-1.429h17a1.433 1.433 0 0 1 1.429 1.429 1.433 1.433 0 0 1-1.429 1.429m0 6.713h-17a1.433 1.433 0 0 1-1.429-1.429 1.433 1.433 0 0 1 1.429-1.43h17a1.433 1.433 0 0 1 1.429 1.429 1.433 1.433 0 0 1-1.429 1.43m-10.485 6.714h-6.619a1.433 1.433 0 0 1-1.429-1.429 1.433 1.433 0 0 1 1.429-1.429h6.619a1.433 1.433 0 0 1 1.431 1.428 1.433 1.433 0 0 1-1.431 1.43m26.685 13.523a23.4 23.4 0 0 0-3.756-1.645c-2.2-.747-3.295-1.009-3.295-2.328s-.278-1.274.454-2.064a4.74 4.74 0 0 0 .967-2.048 3 3 0 0 1 .528-1.406 3.5 3.5 0 0 0 .439-1.493c0-.323.116-.849-.321-.878a7.4 7.4 0 0 0 .086-2.842c-.29-1.2-.787-3.379-4.7-3.6-3.91.219-4.408 2.4-4.7 3.6a7.4 7.4 0 0 0 .086 2.842c-.437.029-.321.555-.321.878a3.5 3.5 0 0 0 .439 1.493 3 3 0 0 1 .528 1.406 4.74 4.74 0 0 0 .966 2.051c.732.79.454.746.454 2.064s-1.1 1.581-3.295 2.328a23.4 23.4 0 0 0-3.756 1.645 1.63 1.63 0 0 0-.75 1.36v1.871h20.697v-1.874a1.63 1.63 0 0 0-.75-1.36" />
	</svg>
);
const ForwardRef = forwardRef(SvgAccountActors);
export default ForwardRef;
