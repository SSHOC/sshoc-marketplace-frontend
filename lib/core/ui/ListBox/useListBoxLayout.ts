import type { ListLayoutOptions } from "@react-stately/layout";
import { ListLayout } from "@react-stately/layout";
import { useMemo } from "react";

export type ListBoxHeights = Pick<
	ListLayoutOptions,
	"estimatedHeadingSize" | "estimatedRowSize" | "loaderSize" | "padding"
>;

export function useListBoxLayout<T extends object>(options?: ListBoxHeights): ListLayout<T> {
	return useMemo(
		() =>
			new ListLayout<T>({
				estimatedHeadingSize: 26,
				estimatedRowSize: 36,
				loaderSize: 40,
				padding: 8,
				...options,
			}),
		[options],
	);
}
