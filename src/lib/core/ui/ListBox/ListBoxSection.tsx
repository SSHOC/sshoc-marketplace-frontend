import { useListBoxSection } from "@react-aria/listbox";
import { useSeparator } from "@react-aria/separator";
import {
  layoutInfoToStyle,
  useVirtualizerItem,
  type VirtualizerItemOptions,
} from "@react-aria/virtualizer";
import type { Node } from "@react-types/shared";
import type { ForwardedRef, ReactNode } from "react";
import { forwardRef, Fragment, useRef } from "react";
import { LayoutInfo } from "@react-stately/virtualizer";

import css from "@/lib/core/ui/ListBox/ListBoxBase.module.css";
import { useListBoxContext } from "@/lib/core/ui/ListBox/useListBoxContext";

export interface ListBoxSectionProps<T extends object>
  extends Omit<VirtualizerItemOptions, "ref"> {
  children: ReactNode;
  headerLayoutInfo: LayoutInfo;
  item: Node<T>;
}

export const ListBoxSection = forwardRef(function ListBoxSection<
  T extends object
>(
  props: ListBoxSectionProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
): JSX.Element {
  let { children, layoutInfo, headerLayoutInfo, virtualizer, item } = props;

  const { headingProps, groupProps } = useListBoxSection({
    "aria-label": item["aria-label"],
    heading: item.rendered,
  });

  const { separatorProps } = useSeparator({ elementType: "li" });

  const headerRef = useRef<HTMLDivElement>(null);
  useVirtualizerItem({
    layoutInfo: headerLayoutInfo,
    virtualizer,
    ref: headerRef,
  });

  const direction = "ltr";
  const state = useListBoxContext<T>();

  return (
    <Fragment>
      <div
        ref={headerRef}
        className={css["listbox-section"]}
        role="presentation"
        style={layoutInfoToStyle(headerLayoutInfo, direction)}
      >
        {item.key !== state.collection.getFirstKey() ? (
          <div {...separatorProps} />
        ) : null}
        {item.rendered != null ? (
          <div {...headingProps}>{item.rendered}</div>
        ) : null}
      </div>
      <div {...groupProps} style={layoutInfoToStyle(layoutInfo, direction)}>
        {children}
      </div>
    </Fragment>
  );
}) as <T extends object>(
  props: ListBoxSectionProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => JSX.Element;
