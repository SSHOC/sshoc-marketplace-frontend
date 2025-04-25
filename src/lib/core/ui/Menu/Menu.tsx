import { useMenu } from "@react-aria/menu";
import { mergeProps } from "@react-aria/utils";
import { useTreeState } from "@react-stately/tree";
import type { AriaMenuProps } from "@react-types/menu";
import type { Alignment } from "@react-types/shared";
import type { ForwardedRef } from "react";
import { forwardRef, useRef } from "react";
import useComposedRef from "use-composed-ref";

import css from "@/lib/core/ui/Menu/Menu.module.css";
import { MenuItem } from "@/lib/core/ui/Menu/MenuItem";
import { MenuSection } from "@/lib/core/ui/Menu/MenuSection";
import { useMenuContext } from "@/lib/core/ui/Menu/useMenuContext";

export interface MenuProps<T extends object> extends AriaMenuProps<T> {
	/** @default 'start' */
	align?: Alignment;
	/** @default 'bottom' */
	direction?: "bottom" | "end" | "left" | "right" | "start" | "top";
	/** @default true */
	shouldFlip?: boolean;
	isDisabled?: boolean;
	/** @default 'primary' */
	variant?: "primary";
}

export const Menu = forwardRef(function Menu<T extends object>(
	props: MenuProps<T>,
	forwardedRef: ForwardedRef<HTMLUListElement>,
): JSX.Element {
	const { variant = "primary" } = props;

	const contextProps = useMenuContext();
	const mergedProps = mergeProps(contextProps, props);

	const menuRef = useRef<HTMLUListElement>(null);
	const state = useTreeState<T>(mergedProps);
	const { menuProps } = useMenu<T>(mergedProps, state, menuRef);

	const mergedRef = useComposedRef(contextProps.ref, forwardedRef);
	const ref = useComposedRef(menuRef, mergedRef);

	return (
		<ul ref={ref} {...menuProps} className={css["menu"]}>
			{[...state.collection].map((item) => {
				if (item.type === "section") {
					return (
						<MenuSection
							key={item.key}
							item={item}
							state={state}
							onAction={mergedProps.onAction}
							variant={variant}
						/>
					);
				}

				let menuItem = (
					<MenuItem
						key={item.key}
						item={item}
						state={state}
						onAction={mergedProps.onAction}
						variant={variant}
					/>
				);

				if (item.wrapper) {
					menuItem = item.wrapper(menuItem);
				}

				return menuItem;
			})}
		</ul>
	);
}) as <T extends object>(
	props: MenuProps<T> & { ref?: ForwardedRef<HTMLUListElement> },
) => JSX.Element;
