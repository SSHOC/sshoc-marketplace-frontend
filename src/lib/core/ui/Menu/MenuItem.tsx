import { useFocusRing } from "@react-aria/focus";
import { useHover } from "@react-aria/interactions";
import { useMenuItem } from "@react-aria/menu";
import { mergeProps } from "@react-aria/utils";
import type { TreeState } from "@react-stately/tree";
import type { Node } from "@react-types/shared";
import type { ForwardedRef, Key } from "react";
import { forwardRef, useRef } from "react";
import useComposedRef from "use-composed-ref";

import { Link } from "@/components/common/Link";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import CheckmarkIcon from "@/lib/core/ui/icons/checkmark.svg?symbol-icon";
import css from "@/lib/core/ui/Menu/Menu.module.css";
import { useMenuContext } from "@/lib/core/ui/Menu/useMenuContext";

export interface MenuItemProps<T extends object> {
	item: Node<T>;
	state: TreeState<T>;
	isVirtualized?: boolean;
	onAction?: (key: Key) => void;
	/** @default 'primary' */
	variant?: "primary";
}

export const MenuItem = forwardRef(function MenuItem<T extends object>(
	props: MenuItemProps<T>,
	forwardedRef: ForwardedRef<HTMLLIElement>,
): ReactNode {
	const { item, state, isVirtualized, onAction, variant = "primary" } = props;

	const { onClose, closeOnSelect } = useMenuContext();

	const { rendered, key } = item;

	const isSelected = state.selectionManager.isSelected(key);
	const isDisabled = state.disabledKeys.has(key);

	const menuItemRef = useRef<HTMLLIElement>(null);
	const { menuItemProps } = useMenuItem(
		{
			isSelected,
			isDisabled,
			"aria-label": item["aria-label"],
			key,
			onClose,
			closeOnSelect,
			isVirtualized,
			onAction,
		},
		state,
		menuItemRef,
	);

	const { focusProps, isFocusVisible } = useFocusRing({});
	const { hoverProps, isHovered } = useHover({ isDisabled });

	const contents = <span>{rendered}</span>;

	const ref = useComposedRef(menuItemRef, forwardedRef);

	if (item.props.href != null) {
		return (
			<li
				ref={ref}
				{...mergeProps(focusProps, hoverProps, menuItemProps)}
				className={css["menu-item"]}
				data-variant={variant}
				data-hovered={isHovered ? "" : undefined}
				data-focused={isFocusVisible ? "" : undefined}
				role="presentation"
			>
				<Link href={item.props.href} rel={item.props.rel} target={item.props.target}>
					{contents}
				</Link>
			</li>
		);
	}

	return (
		<li
			ref={ref}
			{...mergeProps(focusProps, hoverProps, menuItemProps)}
			className={css["menu-item"]}
			data-variant={variant}
			data-hovered={isHovered ? "" : undefined}
			data-focused={isFocusVisible ? "" : undefined}
		>
			{contents}
			{isSelected ? <Icon icon={CheckmarkIcon} /> : null}
		</li>
	);
}) as <T extends object>(
	props: MenuItemProps<T> & { ref?: ForwardedRef<HTMLLIElement> },
) => JSX.Element;
