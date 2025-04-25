import type { FieldArrayRenderProps } from "react-final-form-arrays";

import { ReviewControls } from "@/components/item-form/ReviewControls";
import css from "@/components/item-form/ReviewField.module.css";
import type { Status } from "@/components/item-form/useItemDiffFormFieldsMetadata";
import { useReviewFieldLabels } from "@/components/item-form/useReviewFieldLabels";
import { useReviewFieldListItemMetadata } from "@/components/item-form/useReviewFieldListItemMetadata";

export interface ReviewFieldListItemProps<T> {
	children: JSX.Element;
	name: string;
	fields: FieldArrayRenderProps<any, HTMLElement>["fields"];
	index: number;
	review: (props: {
		createLabel: (label: string) => string;
		status: Status;
		value: T | undefined;
	}) => JSX.Element;
}

export function ReviewFieldListItem<T>(props: ReviewFieldListItemProps<T>): JSX.Element {
	const { children, name, fields, index, review } = props;

	const meta = useReviewFieldListItemMetadata<T>({ name, fields, index });
	const labels = useReviewFieldLabels();

	if (meta.metadata != null && meta.metadata.status !== "unchanged") {
		return (
			<div className={css["container"]} role="group">
				<ReviewControls
					metadata={meta.metadata}
					onApprove={meta.onApprove}
					onReject={meta.onReject}
				/>
				{review({
					createLabel: labels.suggested,
					status: meta.metadata.status,
					value:
						meta.metadata.status === "deleted" ? meta.metadata.current : meta.metadata.suggested,
				})}
				{meta.metadata.status === "changed"
					? review({
							createLabel: labels.current,
							status: "unchanged",
							value: meta.metadata.current,
						})
					: null}
			</div>
		);
	}

	return children;
}
