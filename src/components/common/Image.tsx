import type { ImageProps as NextImageProps, StaticImageData } from "next/image";
import NextImage from "next/image";
import type { ReactNode } from "react";

export type ImageProps = NextImageProps;

export function Image(props: ImageProps): ReactNode {
	const showPlaceholder =
		typeof props.src === "string"
			? props.blurDataURL != null
			: (props.src as StaticImageData).blurDataURL != null;

	return (
		<NextImage
			placeholder={showPlaceholder ? "blur" : undefined}
			{...props}
			sizes="55rem"
			style={{
				width: "100%",
				height: "auto",
			}}
		/>
	);
}
