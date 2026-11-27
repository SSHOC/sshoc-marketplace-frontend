import css from "@/lib/core/ui/ListBox/ListBoxBase.module.css";
import selectCss from "@/lib/core/ui/Select/Select.module.css";

import { composeRenderProps, ListBoxItem, type ListBoxItemProps } from "react-aria-components";

import { Icon } from "@/lib/core/ui/Icon/Icon";
import CheckmarkIcon from "@/lib/core/ui/icons/checkmark";

/** Collection item for RAC-based Selects; legacy collections continue to use Item. */
export function SelectItem<T extends object>(props: ListBoxItemProps<T>) {
	const { children, className, textValue, ...rest } = props;
	return (
		<ListBoxItem
			{...rest}
			textValue={textValue ?? (typeof children === "string" ? children : undefined)}
			className={composeRenderProps(className, (value) =>
				[css["listbox-option"], selectCss["option"], value].filter(Boolean).join(" "),
			)}
		>
			{(state) => (
				<>
					<span>{typeof children === "function" ? children(state) : children}</span>
					{state.isSelected ? <Icon icon={CheckmarkIcon} /> : null}
				</>
			)}
		</ListBoxItem>
	);
}
