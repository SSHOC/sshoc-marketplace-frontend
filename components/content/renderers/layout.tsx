import type { DocumentRendererProps } from "@keystatic/core/renderer";

type Renderers = NonNullable<DocumentRendererProps["renderers"]>;
type BlockRenderers = NonNullable<Renderers["block"]>;

export const layout: BlockRenderers["layout"] = function Layout(props) {
	const { children, layout } = props;

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: layout.map((x) => `${x}fr`).join(" "),
				gap: 16,
			}}
		>
			{children.map((child, index) => (
				<div key={index}>{child}</div>
			))}
		</div>
	);
};
