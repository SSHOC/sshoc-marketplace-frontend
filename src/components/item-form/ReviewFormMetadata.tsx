import type { ReactNode } from "react";
import { Fragment } from "react";

import { useItemDiffFormFieldsMetadata } from "@/components/item-form/useItemDiffFormFieldsMetadata";
import type { ItemsDiff } from "@/data/sshoc/api/item";

export interface ReviewFormMetadataProps {
	children?: ReactNode;
	diff: ItemsDiff | undefined;
}

export function ReviewFormMetadata(props: ReviewFormMetadataProps): JSX.Element {
	const { children, diff } = props;

	/**
	 * Attaches field metadata. Needs to run *after* all fields have been registered.
	 */
	useItemDiffFormFieldsMetadata(diff);

	// eslint-disable-next-line react/jsx-no-useless-fragment
	return <Fragment>{children}</Fragment>;
}
