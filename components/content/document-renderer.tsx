import "server-only";

import {
	DocumentRenderer as KeystaticRenderer,
	type DocumentRendererProps as KeystaticRendererProps,
} from "@keystatic/core/renderer";
import type { ReactNode } from "react";

import { aside } from "@/components/content/components/aside";
import { download } from "@/components/content/components/download";
import { embed } from "@/components/content/components/embed";
import { figure } from "@/components/content/components/figure";
import { code } from "@/components/content/renderers/code";
import { layout } from "@/components/content/renderers/layout";
import { link } from "@/components/content/renderers/link";

const components = {
	aside,
	download,
	embed,
	figure,
};

const renderers = {
	block: {
		code,
		layout,
	},
	inline: {
		link,
	},
};

interface DocumentRendererProps {
	document: KeystaticRendererProps["document"];
}

export function DocumentRenderer(props: DocumentRendererProps): ReactNode {
	const { document } = props;

	return (
		<KeystaticRenderer componentBlocks={components} document={document} renderers={renderers} />
	);
}
