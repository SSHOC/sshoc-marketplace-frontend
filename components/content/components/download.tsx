import type { ComponentBlocks } from "@/components/content/components/component-blocks";

export const download: ComponentBlocks["download"] = function Download(props) {
	const { file, label } = props;

	return (
		<a download href={file}>
			{label}
		</a>
	);
};
