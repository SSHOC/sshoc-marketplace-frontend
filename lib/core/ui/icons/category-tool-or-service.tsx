// Converted from public/assets/images/categories/tool-or-service.svg. Keep the original SVG as the source asset.
import type { ReactNode, Ref, SVGProps } from "react";
import { forwardRef } from "react";
interface SVGRProps {
	title?: ReactNode;
	titleId?: string;
}
const SvgCategoryToolOrService = (
	{ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
	ref: Ref<SVGSVGElement>,
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 85.039 85.039"
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
			fill="#494949"
			d="M75.325 65.647H29.917a1.486 1.486 0 0 1-1.486-1.486V21.685c0-.82.665-1.486 1.486-1.486h45.408c.82 0 1.486.665 1.486 1.486v42.476c0 .82-.666 1.486-1.486 1.486"
			opacity={0.38}
		/>
		<path fill="#1e527c" d="m38.384 9.742-.03 34.837L6.995 60.257 5.97 25.953z" />
		<path
			fill="#74dbfb"
			d="M74.782 65.076H29.374c-.82 0-1.486-.666-1.486-1.486V21.114c0-.82.665-1.486 1.486-1.486h45.408c.82 0 1.486.665 1.486 1.486V63.59c0 .82-.665 1.486-1.486 1.486"
		/>
		<path
			d="M76.268 31.65V20.937a1.31 1.31 0 0 0-1.31-1.31h-45.76a1.31 1.31 0 0 0-1.31 1.31v10.711h48.38zm-33.006 7.788-8.94 8.94 8.94 8.94v-5.624l-3.282-3.272 3.31-3.318zm16.248-.043v5.625l3.281 3.272-3.309 3.318.028 5.665 8.94-8.94zM45.505 57.319h3.918l7.928-17.967h-3.918z"
			style={{
				fill: "#439be9",
			}}
		/>
		<path
			d="m43.22 38.94-8.94 8.94 8.94 8.94v-5.625l-3.282-3.272 3.309-3.318zm16.248-.044v5.625l3.281 3.272-3.309 3.318.028 5.666 8.94-8.94zM45.463 56.82h3.917l7.929-17.967H53.39z"
			style={{
				fill: "#fff",
			}}
		/>
		<path
			fill="#494949"
			d="M38.71 45.536c.046-1.86-1.276-2.503-1.276-2.503l-1.753-1-21.946-12.71-1.726-1a.65.65 0 0 1-.244-.223l-5.12-2.93a2.64 2.64 0 0 0-.424 1.475V59.14c.01.308.122 1.126 1.03 1.646l2.554 1.463 24.396 14.17L36.09 77.5l.846.485s.21.112.315.145q.081.026.177.044c.237.042.557.052.82-.1.283-.163.5-.51.484-1.2V48.239l-.023-2.702z"
			opacity={0.38}
		/>
		<path
			fill="#2d70c1"
			d="m37.13 42.118-1.752-1L13.91 28.68l-.478-.273-1.727-.999c-.579-.33-.2-.777.008-.864l25.492-14.9a2.46 2.46 0 1 0-2.46-4.26l-9.04 5.4L7.136 23.44a2.66 2.66 0 0 0-1.218 2.29v32.495c.01.309.122 1.127 1.03 1.647L9.5 61.334l24.396 14.169 1.889 1.082.846.484s.21.112.316.146q.081.026.176.044c.237.042.558.051.821-.101.282-.163.5-.51.483-1.199V47.323l-.022-2.702c.046-1.86-1.276-2.503-1.276-2.503z"
		/>
	</svg>
);
const ForwardRef = forwardRef(SvgCategoryToolOrService);
export default ForwardRef;
