import type { ReactNode } from "react";

import css from "@/components/common/ItemDescription.module.css";
import { maxPreviewDescriptionLength } from "@/config/sshoc.config";
import { usePlaintext } from "@/lib/utils/hooks";

export interface ItemDescriptionProps {
	text: string;
}

export function ItemDescription(props: ItemDescriptionProps): ReactNode {
	const plaintext = usePlaintext({ markdown: props.text }).slice(0, maxPreviewDescriptionLength);

	return <p className={css["text"]}>{plaintext}</p>;
}
