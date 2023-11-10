import type { ComponentBlocks } from "@/components/content/components/component-blocks";

export const figure: ComponentBlocks["figure"] = function Figure(props) {
	const { caption, image } = props;

	return (
		<figure>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img alt="" loading="lazy" src={image} />
			<figcaption>{caption}</figcaption>
		</figure>
	);
};
