import { useCollator } from "@react-aria/i18n";
import type { ListLayoutOptions } from "@react-stately/layout";
import { ListLayout } from "@react-stately/layout";
import type { ListState } from "@react-stately/list";
import { useLayoutEffect, useMemo } from "react";

export type ListBoxHeights<T> = Pick<
  ListLayoutOptions<T>,
  | "estimatedHeadingHeight"
  | "estimatedRowHeight"
  | "loaderHeight"
  | "padding"
  | "placeholderHeight"
>;

export function useListBoxLayout<T extends object>(
  state: ListState<T>,
  isLoading: boolean
): ListLayout<T> {
  const collator = useCollator({ usage: "search", sensitivity: "base" });
  const layout = useMemo(() => {
    return new ListLayout<T>({
      collator,
      estimatedHeadingHeight: 26,
      estimatedRowHeight: 36,
      loaderHeight: 40,
      padding: 8,
      placeholderHeight: 36,
    });
  }, [collator]);

  layout.collection = state.collection;
  layout.disabledKeys = state.disabledKeys;

  useLayoutEffect(() => {
    if (layout.isLoading !== isLoading) {
      layout.isLoading = isLoading;
      layout.virtualizer?.relayoutNow();
    }
  }, [layout, isLoading]);

  return layout;
}
