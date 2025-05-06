import type { ReactNode } from "react";

import type { VideoProvider } from "@/lib/content/options";
import { createVideoUrl } from "@/lib/keystatic/create-video-url";

interface VideoProps {
	children: ReactNode;
	id: string;
	provider: VideoProvider;
	startTime?: number | null;
	/** Added by `with-iframe-titles` mdx plugin. */
	title?: string;
}

export function Video(props: Readonly<VideoProps>): ReactNode {
	const { children, id, provider, startTime, title } = props;

	const src = String(createVideoUrl(provider, id, startTime));

	return (
		<figure className="flex flex-col gap-y-1">
			<iframe
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowFullScreen={true}
				className="aspect-video w-full overflow-hidden rounded-sm border border-neutral-150"
				referrerPolicy="strict-origin-when-cross-origin"
				src={src}
				title={title}
			/>
			{children != null ? (
				<figcaption className="text-sm text-neutral-700">{children}</figcaption>
			) : null}
		</figure>
	);
}
