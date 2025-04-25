import { findAll } from "highlight-words-core";
import { Fragment, type ReactNode } from "react";

import css from "@/lib/core/ui/HighlightedText/HighlightedText.module.css";

export interface HighlightedTextProps {
	searchPhrase: string;
	text: string;
}

export function HighlightedText(props: HighlightedTextProps): ReactNode {
	const { text, searchPhrase } = props;

	const searchWords = searchPhrase.split(/\s+/);

	const chunks = findAll({
		searchWords,
		textToHighlight: text,
		autoEscape: true,
	});

	return (
		<Fragment>
			{chunks.map((chunk) => {
				const { start, end, highlight } = chunk;

				const segment = text.slice(start, end);

				if (highlight === false) {
					return segment;
				}

				return (
					<mark key={start} className={css["highlight"]}>
						{segment}
					</mark>
				);
			})}
		</Fragment>
	);
}
