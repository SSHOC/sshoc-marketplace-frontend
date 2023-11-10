import "server-only";
import "@/styles/shiki.css";

import type { ReactNode } from "react";
import { codeToHtml } from "shikiji";

interface CodeBlockProps {
	code: string;
	language: string;
}

// @ts-expect-error Upstream type issue.
export async function CodeBlock(props: CodeBlockProps): Promise<ReactNode> {
	const { code, language } = props;

	const html = await codeToHtml(code, {
		defaultColor: "light",
		lang: language,
		themes: {
			light: "github-light",
			dark: "github-dark",
		},
	});

	return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
