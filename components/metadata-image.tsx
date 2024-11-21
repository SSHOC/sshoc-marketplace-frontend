import { ImageResponse } from "next/og";

import type { Locale } from "@/config/i18n.config";

interface MetadataImageProps {
	locale: Locale;
	size: { width: number; height: number };
	title: string;
}

export async function MetadataImage(props: Readonly<MetadataImageProps>): Promise<ImageResponse> {
	const { locale, size, title } = props;

	/**
	 * FIXME: Variable fonts are currently not supported by `satori`.
	 *
	 * @see https://github.com/vercel/satori/issues/162
	 */
	const font = await fetch(
		new URL("../public/assets/fonts/ubuntu-medium.ttf", import.meta.url),
	).then((res) => {
		return res.arrayBuffer();
	});

	return new ImageResponse(
		(
			<div
				lang={locale}
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 32,
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
					height: "100%",
					padding: 16,
					backgroundColor: "#fff",
				}}
			>
				<svg aria-hidden={true} height={200} viewBox="0 0 1200 1200" width={200}>
					<g strokeWidth="9.031">
						<path
							d="M398.614 506.14a34.806 34.806 0 1 0 60.018-35.265l-70.439-119.93a34.807 34.807 0 0 0-60.027 35.256l70.439 119.94z"
							fill="#ff9e1a"
						/>
						<path
							d="m234.784 484.12 84.364 143.65a34.508 34.508 0 1 0 59.512-34.949l-84.346-143.65a34.515 34.515 0 1 0-59.521 34.949z"
							fill="#0085ca"
						/>
						<path
							d="M1172.904 341.784c-2.664-4.614-8.353-8.181-19.633-7.91h-468.9l-44.25.379c-30.46-.768-40.981 20.879-40.981 20.879l-16.364 28.699-203.67 351.51-4.47 7.838-16.346 28.266c-5.419 9.483-12.733 3.288-14.16-.126l-243.97-417.41a40.281 40.281 0 1 0-69.771 40.277l88.446 148.01 174.45 304.09c4.786 7.288 16.11 19.94 37.504 19.94h532.1c5.039-.154 18.423-1.987 26.947-16.86l23.958-41.83 232-399.46 17.718-30.921 7.947-13.862s1.824-3.432 2.366-5.166c.27-.866.542-1.869.722-2.89.696-3.883.85-9.12-1.643-13.446zm-349.16 434.23-364.38-.731 204.54-350.48h364.66l-204.81 351.2z"
							fill="#02558c"
						/>
						<path
							d="M224.264 398.036a34.508 34.508 0 1 0-34.949-59.512 34.508 34.508 0 0 0 34.949 59.512z"
							fill="#0085ca"
						/>
					</g>
				</svg>
				<div
					style={{
						fontWeight: 500,
						fontSize: 48,
						textAlign: "center",
						textWrap: "balance",
					}}
				>
					{title}
				</div>
			</div>
		),
		{
			...size,
			fonts: [
				{
					data: font,
					name: "Ubuntu",
					style: "normal",
					weight: 500,
				},
			],
		},
	);
}
