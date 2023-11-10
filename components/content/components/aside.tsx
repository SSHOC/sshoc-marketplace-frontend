import type { ComponentBlocks } from "@/components/content/components/component-blocks";

export const aside: ComponentBlocks["aside"] = function Aside(props) {
	const { content, type } = props;

	return <aside>{content}</aside>;
};
