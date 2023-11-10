import type { DocumentRendererProps } from "@keystatic/core/renderer";

import { CodeBlock } from "@/components/code-block";

type Renderers = NonNullable<DocumentRendererProps["renderers"]>;
type BlockRenderers = NonNullable<Renderers["block"]>;

export const code: BlockRenderers["code"] = function Code(props) {
	const { children, language = "text" } = props;

	return <CodeBlock code={children} language={language} />;
};
