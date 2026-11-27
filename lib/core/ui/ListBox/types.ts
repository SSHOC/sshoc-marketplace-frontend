import type { ListLayoutOptions } from "react-aria-components";

export type ListBoxHeights = Pick<
	ListLayoutOptions,
	"estimatedHeadingSize" | "estimatedRowSize" | "loaderSize" | "padding"
>;
