import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import type { Locale } from "@/config/i18n.config";

interface MetadataImageProps {
	locale: Locale;
	size: { width: number; height: number };
	title: string;
}

export async function MetadataImage(props: MetadataImageProps): Promise<ImageResponse> {
	const { locale, size, title } = props;

	/**
	 * FIXME: `fetch` works in `edge` runtime (which currently does not work with `next-intl` middleware).
	 * In node.js we need to read from the filesystem.
	 *
	 * @see https://github.com/vercel/next.js/issues/48295
	 */
	/**
	 * FIXME: Variable fonts are currently not supported by `satori`.
	 *
	 * @see https://github.com/vercel/satori/issues/162
	 */
	// const inter = await fetch(new URL("../assets/fonts/inter-semibold.ttf", import.meta.url)).then(
	// 	(res) => {
	// 		return res.arrayBuffer();
	// 	},
	// );
	const inter = await readFile(join(process.cwd(), "/assets/fonts/inter-semibold.ttf"));

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
				<svg viewBox="0 0 1200 1200">
					<g stroke-width="9.031">
						<path
							d="M418.249 515.294a31.412 31.412 0 1 0 54.166-31.827l-63.57-108.237a31.414 31.414 0 0 0-54.175 31.819l63.57 108.246z"
							fill="#ff9e1a"
						/>
						<path
							d="m270.392 495.42 76.139 129.645a31.143 31.143 0 1 0 53.71-31.541l-76.123-129.645a31.15 31.15 0 1 0-53.717 31.542z"
							fill="#0085ca"
						/>
						<path
							d="M1117.046 366.963c-2.405-4.165-7.539-7.384-17.719-7.14H676.145l-39.936.343c-27.49-.693-36.985 18.843-36.985 18.843l-14.769 25.9-183.812 317.239-4.034 7.074-14.753 25.51c-4.89 8.558-11.491 2.967-12.779-.114L148.894 377.905a36.354 36.354 0 1 0-62.968 36.35l79.822 133.58 157.441 274.44c4.32 6.578 14.54 17.997 33.848 17.997h480.22c4.548-.139 16.627-1.794 24.32-15.217l21.622-37.751 209.38-360.513 15.99-27.906 7.172-12.51s1.647-3.098 2.136-4.662c.244-.783.489-1.687.652-2.608.627-3.505.766-8.232-1.484-12.136zM801.929 758.856l-328.853-.66 184.597-316.309H986.78L801.938 758.845z"
							fill="#02558c"
						/>
						<path
							d="M260.898 417.73a31.143 31.143 0 1 0-31.541-53.71 31.143 31.143 0 0 0 31.541 53.71z"
							fill="#0085ca"
						/>
					</g>
				</svg>
				<div
					style={{
						fontWeight: 600,
						fontSize: 48,
						textAlign: "center",
						// @ts-expect-error `text-wrap` is supported by `satori`.
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
					data: inter,
					name: "Inter",
					style: "normal",
					weight: 600,
				},
			],
		},
	);
}
