import type { ReactNode } from "react";

interface EmbedProps {
	children?: ReactNode;
	src: string;
	/** Maybe added by `with-iframe-titles` mdx plugin. */
	title?: string;
}

export function Embed(props: EmbedProps): ReactNode {
	const { children, src, title } = props;

	return (
		<figure className="flex flex-col gap-y-1">
			<iframe
				src={src}
				title={title}
				allow="encrypted-media; picture-in-picture; web-share"
				allowFullScreen
				className="aspect-video w-full overflow-hidden rounded-sm border border-neutral-150"
				referrerPolicy="strict-origin-when-cross-origin"
			/>
			{children != null ? (
				<figcaption className="text-sm text-neutral-700">{children}</figcaption>
			) : null}
		</figure>
	);
}
