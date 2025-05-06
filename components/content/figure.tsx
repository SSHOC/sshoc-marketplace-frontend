import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import type { FigureAlignment } from "@/lib/content/options";

interface FigureProps {
	alignment?: FigureAlignment;
	alt?: string;
	children?: ReactNode;
	/** Maybe added by `with-image-sizes` mdx plugin. */
	height?: number;
	src: string;
	/** Maybe added by `with-image-sizes` mdx plugin. */
	width?: number;
}

export function Figure(props: FigureProps): ReactNode {
	const { alignment = "stretch", alt = "", children, height, src, width } = props;

	return (
		<figure
			className={cn("flex flex-col gap-y-1", alignment === "center" ? "justify-center" : undefined)}
		>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				alt={alt}
				src={src}
				className="m-0! overflow-hidden rounded-sm border border-neutral-150"
				height={height}
				width={width}
			/>
			{children != null ? (
				<figcaption className="text-sm text-neutral-700">{children}</figcaption>
			) : null}
		</figure>
	);
}
