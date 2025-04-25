import type { ImageProps as NextImageProps, StaticImageData } from "next/legacy/image";
import NextImage from "next/legacy/image";

export type ImageProps = NextImageProps;

export function Image(props: ImageProps): JSX.Element {
	const showPlaceholder =
		typeof props.src === "string"
			? props.blurDataURL != null
			: (props.src as StaticImageData).blurDataURL != null;

	return (
		<NextImage
			sizes="55rem"
			layout="responsive"
			placeholder={showPlaceholder ? "blur" : undefined}
			{...props}
		/>
	);
}
