import type { ReactNode } from "react";

import { ItemCategoryIcon } from "@/components/item-category-icon";
import { ServerImage } from "@/components/server-image";
import { getMediaThumbnailUrl, type ItemCategory } from "@/lib/api/client";

interface ItemThumbnailProps {
	category: ItemCategory;
	mediaId?: string;
}

export function ItemThumbnail(props: Readonly<ItemThumbnailProps>): ReactNode {
	const { category, mediaId } = props;

	// TODO: priority?

	if (mediaId == null) {
		return <ItemCategoryIcon aria-hidden={true} category={category} className="size-20 shrink-0" />;
	}

	return (
		<ServerImage
			alt=""
			className="size-20 shrink-0 object-contain"
			src={String(getMediaThumbnailUrl(mediaId))}
			unoptimized={true}
		/>
	);
}
