import css from "@/lib/core/ui/ComboBox/ComboBox.module.css";
import buttonCss from "@/lib/core/ui/FieldButton/FieldButton.module.css";
import listCss from "@/lib/core/ui/ListBox/ListBoxBase.module.css";
import textCss from "@/lib/core/ui/TextField/TextFieldBase.module.css";

import type { AriaComboBoxProps } from "@react-types/combobox";
import type {
	Alignment,
	AriaLabelingProps,
	AsyncLoadable,
	LabelableProps,
	LabelPosition,
	LoadingState,
	NecessityIndicator,
} from "@react-types/shared";
import { useTranslations } from "next-intl";
import type { ForwardedRef, ReactNode } from "react";
import { forwardRef, useContext, useEffect, useState } from "react";
import {
	Button,
	Collection,
	ComboBox as AriaComboBox,
	ComboBoxStateContext,
	Group,
	Input,
	ListBox,
	ListBoxLoadMoreItem,
	ListLayout,
	Popover,
	Virtualizer,
} from "react-aria-components";

import { AriaField } from "@/lib/core/ui/Field/AriaField";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import AlertIcon from "@/lib/core/ui/icons/alert";
import CheckmarkIcon from "@/lib/core/ui/icons/checkmark";
import ChevronIcon from "@/lib/core/ui/icons/chevron";
import type { ListBoxHeights } from "@/lib/core/ui/ListBox/types";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";

export interface ComboBoxProps<T extends object>
	extends
		Omit<AriaComboBoxProps<T>, "errorMessage">,
		LabelableProps,
		AriaLabelingProps,
		Omit<AsyncLoadable, "isLoading"> {
	errorMessage?: ReactNode;
	/** @default 'primary' */
	color?: "form" | "primary";
	/** @default 'bottom' */
	direction?: "bottom" | "top";
	isRequired?: boolean;
	maxHeight?: number;
	name?: string;
	/** @default 'start' */
	labelAlign?: Alignment;
	labelPosition?: LabelPosition;
	layout?: ListBoxHeights;
	loadingState?: LoadingState;
	/** @default 'icon' */
	necessityIndicator?: NecessityIndicator;
	shouldFlip?: boolean;
	/** @default 'md' */
	size?: "md" | "sm";
}

export const ComboBox = forwardRef(function ComboBox<T extends object>(
	props: ComboBoxProps<T>,
	ref: ForwardedRef<HTMLDivElement>,
): ReactNode {
	const {
		children,
		color = "primary",
		defaultItems,
		description,
		direction = "bottom",
		errorMessage,
		items,
		label,
		layout,
		loadingState,
		maxHeight,
		menuTrigger = "input",
		onLoadMore,
		placeholder,
		shouldFlip = true,
		size = "md",
		validationState,
		...comboBoxProps
	} = props;
	const t = useTranslations();
	const isAsync = loadingState != null;
	return (
		<AriaComboBox<T>
			{...comboBoxProps}
			ref={ref}
			className={css["combobox"]}
			// Keep the editable input named for Final Form error focus and native text serialization.
			formValue="text"
			items={items}
			defaultItems={defaultItems}
			menuTrigger={menuTrigger}
			allowsEmptyCollection={isAsync}
			isInvalid={props.isInvalid || validationState === "invalid"}
			validationBehavior="aria"
		>
			{({ isOpen }) => (
				<AriaField {...props} label={label} description={description} errorMessage={errorMessage}>
					<Group
						role="presentation"
						className={css["combobox-input-group"]}
						data-color={color}
						data-open={isOpen}
						data-size={size}
					>
						<ComboBoxInput
							color={color}
							size={size}
							loadingState={loadingState}
							isOpen={isOpen}
							menuTrigger={menuTrigger}
							placeholder={placeholder}
							validationState={validationState}
						/>
						<Button
							className={buttonCss["button"]}
							data-color={color}
							data-validation-state={validationState}
						>
							<Icon icon={ChevronIcon} />
						</Button>
					</Group>
					<Popover
						className={css["popover"]}
						placement={`${direction} end`}
						offset={6}
						maxHeight={maxHeight}
						shouldFlip={shouldFlip}
					>
						<Virtualizer
							layout={ListLayout}
							layoutOptions={{
								estimatedHeadingSize: 26,
								estimatedRowSize: 36,
								loaderSize: 40,
								padding: 8,
								...layout,
							}}
						>
							<ListBox<T>
								className={listCss["listbox"]}
								style={{ padding: 0 }}
								data-color={color}
								renderEmptyState={
									isAsync
										? () => (
												<div className={listCss["listbox-option-empty-state"]}>
													{loadingState === "loading" || loadingState === "filtering"
														? t("common.ui.combobox.loading")
														: t("common.ui.combobox.no-results")}
												</div>
											)
										: undefined
								}
							>
								<Collection items={items ?? defaultItems}>{children}</Collection>
								{onLoadMore != null || loadingState === "loadingMore" ? (
									<ListBoxLoadMoreItem
										onLoadMore={loadingState === "loadingMore" ? undefined : onLoadMore}
										isLoading={loadingState === "loadingMore"}
										className={listCss["listbox-progress-spinner-container"]}
									>
										<ProgressSpinner aria-label={t("common.ui.listbox.loading-more")} size="sm" />
									</ListBoxLoadMoreItem>
								) : null}
							</ListBox>
						</Virtualizer>
					</Popover>
				</AriaField>
			)}
		</AriaComboBox>
	);
}) as <T extends object>(
	props: ComboBoxProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReactNode;

interface ComboBoxInputProps {
	color: "form" | "primary";
	size: "md" | "sm";
	loadingState?: LoadingState;
	isOpen: boolean;
	menuTrigger: ComboBoxProps<object>["menuTrigger"];
	placeholder?: string;
	validationState?: ComboBoxProps<object>["validationState"];
}

function ComboBoxInput({
	color,
	size,
	loadingState,
	isOpen,
	menuTrigger,
	placeholder,
	validationState,
}: ComboBoxInputProps) {
	// RAC also renders this subtree while discovering collection items, before state exists.
	const inputValue = useContext(ComboBoxStateContext)?.inputValue;
	const t = useTranslations();
	const isLoading = loadingState === "loading" || loadingState === "filtering";
	const [showLoading, setShowLoading] = useState(false);
	useEffect(() => {
		if (!isLoading || inputValue == null) {
			setShowLoading(false);
			return;
		}
		const timer = setTimeout(() => setShowLoading(true), 500);
		return () => clearTimeout(timer);
	}, [isLoading, inputValue]);
	const showSpinner =
		isLoading && showLoading && (isOpen || menuTrigger === "manual" || loadingState === "loading");
	return (
		<div
			className={textCss["textfield"]}
			data-color={color}
			data-size={size}
			data-loading-state={showSpinner ? "loading" : undefined}
			data-validation-state={validationState}
		>
			<Input className={textCss["textfield-input"]} placeholder={placeholder} />
			{showSpinner ? (
				<div className={textCss["validation-icon"]}>
					<ProgressSpinner aria-label={t("common.ui.combobox.loading")} size="sm" />
				</div>
			) : validationState ? (
				<div className={textCss["validation-icon"]}>
					<Icon icon={validationState === "invalid" ? AlertIcon : CheckmarkIcon} />
				</div>
			) : null}
		</div>
	);
}
