import type { ReactNode } from "react";

interface AvatarProps {
	children?: ReactNode;
	src: string;
}

export function Avatar(props: AvatarProps): ReactNode {
	const { children, src } = props;

	return (
		<figure className="flex flex-col gap-y-1">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				alt=""
				className="m-0! aspect-square w-44 rounded-full border border-neutral-150 object-cover"
				src={src}
			/>
			{children != null ? (
				<figcaption className="text-sm text-neutral-700">{children}</figcaption>
			) : null}
		</figure>
	);
}
