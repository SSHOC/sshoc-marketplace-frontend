import listCss from "@/lib/core/ui/ListBox/ListBoxBase.module.css";
import css from "@/lib/core/ui/SearchAutocomplete/SearchAutocomplete.module.css";
import textCss from "@/lib/core/ui/TextField/TextFieldBase.module.css";

import type { LoadingState } from "@react-types/shared";
import { useTranslations } from "next-intl";
import { type ReactNode, type Ref, useContext, useEffect, useRef, useState } from "react";
import {
	Collection,
	ComboBox,
	type ComboBoxProps,
	type CollectionProps,
	ComboBoxStateContext,
	Group,
	Input,
	type Key,
	ListBox,
	ListBoxLoadMoreItem,
	ListLayout,
	Popover,
	type SearchFieldProps,
	Virtualizer,
} from "react-aria-components";

import { ClearButton } from "@/lib/core/ui/ClearButton/ClearButton";
import { AriaField } from "@/lib/core/ui/Field/AriaField";
import type { FieldProps } from "@/lib/core/ui/Field/Field";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import AlertIcon from "@/lib/core/ui/icons/alert";
import CheckmarkIcon from "@/lib/core/ui/icons/checkmark";
import MagnifierIcon from "@/lib/core/ui/icons/magnifier";
import type { ListBoxHeights } from "@/lib/core/ui/ListBox/types";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";

export interface SearchAutocompleteProps<T extends object>
	extends
		Omit<ComboBoxProps<T>, "children" | "render" | "validate">,
		Pick<CollectionProps<T>, "children">,
		Pick<FieldProps, "description" | "errorMessage" | "label" | "validationState">,
		Pick<SearchFieldProps, "onClear" | "validate"> {
	placeholder?: string;
	/** Submits either the free-text input or the selected suggestion key. */
	onSubmit?: (value: string | null, key: Key | null) => void;
	/** @default 'bottom' */
	direction?: "bottom" | "top";
	layout?: ListBoxHeights;
	loadingState?: LoadingState;
	maxHeight?: number;
	name?: string;
	onLoadMore?: () => void;
	/** @default true */
	shouldFlip?: boolean;
	/** @default 'md' */
	size?: "md" | "sm";
}

export function SearchAutocomplete<T extends object>(
	props: SearchAutocompleteProps<T> & { ref?: Ref<HTMLDivElement> },
): ReactNode {
	const {
		ref,
		children,
		description,
		direction = "bottom",
		errorMessage,
		items,
		defaultItems,
		label,
		layout,
		loadingState,
		maxHeight,
		onClear,
		onSubmit,
		onLoadMore,
		placeholder,
		shouldFlip = true,
		size = "md",
		validate,
		validationState,
		...comboProps
	} = props;
	const t = useTranslations();
	return (
		<ComboBox<T>
			{...comboProps}
			ref={ref}
			items={items}
			defaultItems={defaultItems}
			allowsCustomValue
			allowsEmptyCollection={loadingState != null}
			selectedKey={null}
			onSelectionChange={(key) => {
				if (key != null) onSubmit?.(null, key);
			}}
			validate={validate == null ? undefined : ({ inputValue }) => validate(inputValue)}
			isInvalid={props.isInvalid || validationState === "invalid"}
			validationBehavior="aria"
		>
			<AriaField
				{...comboProps}
				validationState={validationState}
				label={label}
				description={description}
				errorMessage={errorMessage}
			>
				<SearchInput
					size={size}
					placeholder={placeholder}
					onSubmit={onSubmit}
					onClear={onClear}
					isDisabled={props.isDisabled}
					isReadOnly={props.isReadOnly}
					validationState={validationState}
					loadingState={loadingState}
					menuTrigger={props.menuTrigger}
				/>
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
							data-color="primary"
							renderEmptyState={
								loadingState == null
									? undefined
									: () => (
											<div className={listCss["listbox-option-empty-state"]}>
												{loadingState === "loading" || loadingState === "filtering"
													? t("common.ui.autocomplete.loading")
													: t("common.ui.autocomplete.no-results")}
											</div>
										)
							}
						>
							<Collection items={items ?? defaultItems}>{children}</Collection>
							{onLoadMore != null || loadingState === "loadingMore" ? (
								<ListBoxLoadMoreItem
									onLoadMore={
										loadingState == null || loadingState === "idle" ? onLoadMore : undefined
									}
									isLoading={loadingState === "loadingMore"}
									className={listCss["listbox-progress-spinner-container"]}
								>
									<ProgressSpinner size="sm" aria-label={t("common.ui.listbox.loading-more")} />
								</ListBoxLoadMoreItem>
							) : null}
						</ListBox>
					</Virtualizer>
				</Popover>
			</AriaField>
		</ComboBox>
	);
}

function SearchInput(
	props: Pick<
		SearchAutocompleteProps<object>,
		| "size"
		| "placeholder"
		| "onSubmit"
		| "onClear"
		| "isDisabled"
		| "isReadOnly"
		| "validationState"
		| "loadingState"
		| "menuTrigger"
	>,
) {
	const state = useContext(ComboBoxStateContext);
	const inputRef = useRef<HTMLInputElement>(null);
	const value = state?.inputValue ?? "";
	const pending =
		state != null && (props.loadingState === "loading" || props.loadingState === "filtering");
	const [showLoading, setShowLoading] = useState(false);
	useEffect(() => {
		if (!pending) return;
		const timer = setTimeout(() => setShowLoading(true), 500);
		return () => {
			clearTimeout(timer);
			setShowLoading(false);
		};
	}, [pending, value]);
	const showSpinner =
		pending &&
		showLoading &&
		(state?.isOpen || props.menuTrigger === "manual" || props.loadingState === "loading");
	const canClear = value !== "" && !props.isReadOnly;
	function clear() {
		state?.setInputValue("");
		state?.close();
		inputRef.current?.focus();
		props.onClear?.();
	}
	return (
		<Group
			role="presentation"
			className={`${css["autocomplete-input-group"]} ${textCss["textfield"]}`}
			data-color="primary"
			data-size={props.size}
			data-icon={canClear ? "left right" : "left"}
			data-validation-state={props.validationState}
			data-loading-state={showSpinner ? "loading" : undefined}
			onKeyDownCapture={(event) => {
				if (event.target !== inputRef.current || event.nativeEvent.isComposing) return;
				if (
					event.key === "Enter" &&
					props.onSubmit &&
					(!state?.isOpen || state.selectionManager.focusedKey == null)
				) {
					event.preventDefault();
					event.stopPropagation();
					state?.close();
					props.onSubmit(value, null);
				} else if (event.key === "Escape" && !state?.isOpen && canClear && !props.isDisabled) {
					event.preventDefault();
					event.stopPropagation();
					clear();
				}
			}}
		>
			<Input
				ref={inputRef}
				type="search"
				className={textCss["textfield-input"]}
				placeholder={props.placeholder}
			/>
			<div className={textCss["icon-left"]}>
				<Icon icon={MagnifierIcon} />
			</div>
			{showSpinner ? (
				<div className={textCss["validation-icon"]}>
					<ProgressSpinner size="sm" />
				</div>
			) : props.validationState ? (
				<div className={textCss["validation-icon"]}>
					<Icon icon={props.validationState === "invalid" ? AlertIcon : CheckmarkIcon} />
				</div>
			) : null}
			{canClear ? (
				<div className={textCss["icon-right"]}>
					<ClearButton onPress={clear} isDisabled={props.isDisabled} preventFocus />
				</div>
			) : null}
		</Group>
	);
}
