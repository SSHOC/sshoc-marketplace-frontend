import { ReviewControls } from "@/components/item-form/ReviewControls";
import css from "@/components/item-form/ReviewField.module.css";
import type { Status } from "@/components/item-form/useItemDiffFormFieldsMetadata";
import { useReviewFieldMetadata } from "@/components/item-form/useReviewFieldMetadata";

import { useReviewFieldLabels } from "./useReviewFieldLabels";

export interface ReviewFieldProps<T> {
	children: JSX.Element;
	name: string;
	review: (props: {
		createLabel: (label: string) => string;
		status: Status;
		value: T | undefined;
	}) => JSX.Element;
}

export function ReviewField<T>(props: ReviewFieldProps<T>): JSX.Element {
	const { children, name, review } = props;

	const meta = useReviewFieldMetadata<T>({ name });
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
