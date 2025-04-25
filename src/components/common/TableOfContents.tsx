import type { Toc } from "@stefanprobst/rehype-extract-toc";
import type { ReactNode } from "react";

import css from "@/components/common/TableOfContents.module.css";
import { useI18n } from "@/lib/core/i18n/useI18n";

export interface TableOfContentsProps {
	/** @default 2 */
	maxDepth?: number;
	tableOfContents: Toc;
}

export function TableOfContents(props: TableOfContentsProps): ReactNode {
	const { maxDepth = 2, tableOfContents } = props;

	const { t } = useI18n<"common">();

	return (
		<nav aria-label={t(["common", "table-of-contents"])} className={css["nav"]}>
			<h2 className={css["heading"]}>{t(["common", "table-of-contents"])}</h2>
			<Level entries={tableOfContents} depth={1} maxDepth={maxDepth} />
		</nav>
	);
}

interface LevelProps {
	depth: number;
	entries: Toc | undefined;
	maxDepth: number;
}

function Level(props: LevelProps): ReactNode {
	const { depth, entries, maxDepth } = props;

	if (entries == null || entries.length === 0 || depth > maxDepth) {
		return null;
	}

	return (
		<ol className={css["list"]} data-depth={depth > 1 ? "" : undefined} role="list">
			{entries.map((entry) => {
				return (
					<li key={entry.id} className={css["list-item"]}>
						<a href={"#" + String(entry.id)}>{entry.value}</a>
						<Level entries={entry.children} depth={depth + 1} maxDepth={maxDepth} />
					</li>
				);
			})}
		</ol>
	);
}
