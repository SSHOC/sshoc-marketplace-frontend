import css from "@/lib/core/ui/ListBox/ListBoxBase.module.css";

import {
	composeRenderProps,
	ListBoxItem as AriaListBoxItem,
	type ListBoxItemProps,
} from "react-aria-components";

import { Icon } from "@/lib/core/ui/Icon/Icon";
import CheckmarkIcon from "@/lib/core/ui/icons/checkmark";

/** Styled collection item shared by RAC Select and ComboBox. */
export function ListBoxItem<T extends object>(props: ListBoxItemProps<T>) {
	const { children, className, textValue, ...rest } = props;
	return (
		<AriaListBoxItem
			{...rest}
			textValue={textValue ?? (typeof children === "string" ? children : undefined)}
			className={composeRenderProps(className, (value) =>
				[css["listbox-option"], css["rac-option"], value].filter(Boolean).join(" "),
			)}
		>
			{(state) => (
				<>
					<span>{typeof children === "function" ? children(state) : children}</span>
					{state.isSelected ? <Icon icon={CheckmarkIcon} /> : null}
				</>
			)}
		</AriaListBoxItem>
	);
}
