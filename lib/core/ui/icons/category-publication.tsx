// Converted from public/assets/images/categories/publication.svg. Keep the original SVG as the source asset.
import type { ReactNode, Ref, SVGProps } from "react";
import { forwardRef } from "react";
interface SVGRProps {
	title?: ReactNode;
	titleId?: string;
}
const SvgCategoryPublication = (
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
			d="M70.614 67.302H36.438a2.036 2.036 0 0 1-2.03-2.03v-43.97c0-1.116.914-2.03 2.03-2.03H70.94c1.117 0 2.03.914 2.03 2.03v43.559c0 1.302-1.08 2.44-2.356 2.44z"
			opacity={0.38}
		/>
		<path fill="#79284f" d="m44.12 8.837-.008 37.727-32.51-21.593z" />
		<path
			fill="#e54e5c"
			d="M70.338 66.755H35.835a2.036 2.036 0 0 1-2.03-2.03V20.757c0-1.116.914-2.03 2.03-2.03h34.503c1.116 0 2.03.914 2.03 2.03v43.97c0 1.116-.914 2.03-2.03 2.03z"
		/>
		<path
			fill="#bd2946"
			d="M41.123 18.726h-5.288c-1.116 0-2.03.914-2.03 2.03v43.97c0 1.116.914 2.03 2.03 2.03h5.288z"
		/>
		<path
			fill="#494949"
			d="M44.802 45.13c.047-1.86-1.275-2.503-1.275-2.503l-1.752-1-21.946-12.71-1.727-1a.65.65 0 0 1-.244-.223l-5.12-2.93a2.64 2.64 0 0 0-.424 1.475v32.495c.01.308.122 1.126 1.03 1.646l2.554 1.463 24.396 14.169 1.515.867s1.143.533 1.205.544c.238.043.952.22 1.215.068.282-.163.613-.621.597-1.31V47.832z"
			opacity={0.39}
		/>
		<path
			fill="#bc426b"
			d="m42.814 41.359-1.752-1-21.468-12.438-.478-.273-1.727-.999c-.579-.33-.2-.776.008-.864l25.492-14.9a2.46 2.46 0 1 0-2.46-4.26l-9.04 5.4-18.57 10.656a2.66 2.66 0 0 0-1.218 2.29v32.495c.01.308.122 1.126 1.03 1.646l2.554 1.463 24.396 14.169 1.889 1.082.846.485s.21.112.315.145q.083.026.177.044c.237.042.557.051.821-.1.282-.164.5-.51.483-1.2V46.564l-.023-2.702c.047-1.86-1.275-2.503-1.275-2.503"
		/>
		<path fill="#bd2946" d="m63.119 18.997-3.511-.202v11.196l3.51-1.94 3.512 1.94V18.795z" />
		<path fill="#fff" d="M62.901 18.795h-3.51v10.821l3.51-1.94 3.511 1.94V18.795z" />
		<path fill="#bd2946" d="M48.458 38.559h15.469v4.811H48.458z" />
		<path fill="#fff" d="M48.174 38.211h15.469v4.811H48.174z" />
	</svg>
);
const ForwardRef = forwardRef(SvgCategoryPublication);
export default ForwardRef;
