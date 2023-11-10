import type { ComponentBlocks } from "@/components/content/components/component-blocks";

export const embed: ComponentBlocks["embed"] = function Embed(props) {
	const { code, kind } = props;

	return <iframe loading="lazy" />;
};
