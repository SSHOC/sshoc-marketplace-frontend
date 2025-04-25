import type { ReactNode } from "react";

import { ScreenTitle } from "@/components/common/ScreenTitle";
import { CopyLinkToClipboardButton } from "@/components/item/CopyLinkToClipboardButton";
import css from "@/components/item/ItemTitle.module.css";
import { ItemTitleImage } from "@/components/item/ItemTitleImage";
import type { Item } from "@/data/sshoc/api/item";
import { usePathname } from "@/lib/core/navigation/usePathname";

export interface ItemTitleProps {
	category: Item["category"];
	thumbnail: Item["thumbnail"];
	children?: ReactNode;
}

export function ItemTitle(props: ItemTitleProps): JSX.Element {
	const { category, thumbnail } = props;

	const pathname = usePathname();

	return (
		<div className={css["container"]}>
			<ItemTitleImage category={category} thumbnail={thumbnail} />
			<ScreenTitle>{props.children}</ScreenTitle>
			<CopyLinkToClipboardButton href={{ pathname }} />
		</div>
	);
}
