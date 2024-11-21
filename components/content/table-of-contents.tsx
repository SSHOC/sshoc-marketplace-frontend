import { isNonEmptyArray } from "@acdh-oeaw/lib";
import type { TableOfContents } from "@acdh-oeaw/mdx-lib";
import { useTranslations } from "next-intl";
import { type ReactNode, useId } from "react";

interface TableOfContentsProps {
	/** Added by `@acdh-oeaw/mdx-lib#with-table-of-contents`. */
	tableOfContents?: TableOfContents;
	title?: string;
}

export function TableOfContents(props: TableOfContentsProps): ReactNode {
	const { tableOfContents, title } = props;

	const t = useTranslations("TableOfContents");
	const id = useId();

	if (!isNonEmptyArray(tableOfContents)) return null;

	const hasTitle = title != null;

	return (
		<nav aria-label={hasTitle ? undefined : t("title")} aria-labelledby={hasTitle ? id : undefined}>
			{hasTitle ? <h2 id={id}>{title}</h2> : null}
			<div className="not-prose mb-12">
				<TableOfContentsLevel headings={tableOfContents} />
			</div>
		</nav>
	);
}

interface TableOfContentsLevelProps {
	depth?: number;
	headings: TableOfContents;
}

function TableOfContentsLevel(props: TableOfContentsLevelProps): ReactNode {
	const { depth = 0, headings } = props;

	return (
		<ol className="grid gap-y-1.5 text-text-weak" style={{ marginLeft: `${String(depth * 8)}px` }}>
			{headings.map((heading) => {
				return (
					<li key={heading.id} className="grid justify-start gap-y-1.5">
						{heading.id != null ? (
							<a
								className="inline-flex underline decoration-dotted transition hover:text-text-strong hover:decoration-solid"
								href={`#${heading.id}`}
							>
								{heading.value}
							</a>
						) : (
							<span>{heading.value}</span>
						)}
						{isNonEmptyArray(heading.children) ? (
							<TableOfContentsLevel depth={depth + 1} headings={heading.children} />
						) : null}
					</li>
				);
			})}
		</ol>
	);
}