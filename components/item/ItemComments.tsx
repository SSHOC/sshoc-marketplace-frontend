import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { SectionHeader } from "@/components/common/SectionHeader";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Timestamp } from "@/components/common/Timestamp";
import css from "@/components/item/ItemComments.module.css";
import type { Item, ItemComment } from "@/data/sshoc/api/item";
import { useLastItemComments } from "@/data/sshoc/hooks/item";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export interface ItemCommentsProps {
	persistentId: Item["persistentId"];
}

export function ItemComments(props: ItemCommentsProps): ReactNode {
	const { persistentId } = props;

	const t = useTranslations();
	const comments = useLastItemComments({ itemId: persistentId });

	if (comments.data == null) {
		return (
			<Centered>
				<LoadingIndicator />
			</Centered>
		);
	}

	if (comments.data.length === 0) {
		return null;
	}

	return (
		<section className={css["container"]}>
			<SectionHeader>
				<SectionTitle>{t("common.item.comments.other")}</SectionTitle>
			</SectionHeader>
			<ol role="list" className={css["comments"]}>
				{comments.data.map((comment) => {
					return (
						<li key={comment.id}>
							<Comment comment={comment} />
						</li>
					);
				})}
			</ol>
		</section>
	);
}

interface CommentProps {
	comment: ItemComment;
}

function Comment(props: CommentProps): ReactNode {
	const { comment } = props;

	const t = useTranslations();

	return (
		<article className={css["comment"]}>
			<dl className={css["comment-metadata"]}>
				<div>
					<dt>
						<VisuallyHidden>{t("common.item.users.one")}</VisuallyHidden>
					</dt>
					<dd>{comment.creator.displayName}</dd>
				</div>
				<div>
					<dt>
						<VisuallyHidden>{t("common.item.date-last-modified")}</VisuallyHidden>
					</dt>
					<dd>
						<Timestamp dateTime={comment.dateLastUpdated} />
					</dd>
				</div>
			</dl>
			<p className={css["comment-content"]}>{comment.body}</p>
		</article>
	);
}
