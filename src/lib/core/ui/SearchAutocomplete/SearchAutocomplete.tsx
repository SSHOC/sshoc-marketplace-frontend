import { useSearchAutocomplete } from "@react-aria/autocomplete";
import { useFocusRing } from "@react-aria/focus";
import { useFilter } from "@react-aria/i18n";
import { useHover } from "@react-aria/interactions";
import { DismissButton, useOverlayPosition } from "@react-aria/overlays";
import { mergeProps, useLayoutEffect, useResizeObserver } from "@react-aria/utils";
import { useComboBoxState } from "@react-stately/combobox";
import type { SearchAutocompleteProps as AriaSearchAutocompleteProps } from "@react-types/autocomplete";
import type { AriaButtonProps } from "@react-types/button";
import type { Placement } from "@react-types/overlays";
import type { LoadingState } from "@react-types/shared";
import type { ForwardedRef, InputHTMLAttributes, RefObject } from "react";
import { forwardRef, Fragment, useCallback, useEffect, useRef, useState } from "react";
import useComposedRef from "use-composed-ref";

import { useI18n } from "@/lib/core/i18n/useI18n";
import { ClearButton } from "@/lib/core/ui/ClearButton/ClearButton";
import { Field } from "@/lib/core/ui/Field/Field";
// import { useIsMobileDevice } from '@/lib/core/ui/hooks/useIsMobileDevice'
import { Icon } from "@/lib/core/ui/Icon/Icon";
import MagnifierIcon from "@/lib/core/ui/icons/magnifier.svg?symbol-icon";
import { ListBoxBase } from "@/lib/core/ui/ListBox/ListBoxBase";
import type { ListBoxHeights } from "@/lib/core/ui/ListBox/useListBoxLayout";
import { useListBoxLayout } from "@/lib/core/ui/ListBox/useListBoxLayout";
import { Popover } from "@/lib/core/ui/Popover/Popover";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";
import css from "@/lib/core/ui/SearchAutocomplete/SearchAutocomplete.module.css";
import { TextFieldBase } from "@/lib/core/ui/TextField/TextFieldBase";

export interface SearchAutocompleteProps<T extends object> extends AriaSearchAutocompleteProps<T> {
	/** @default 'bottom' */
	direction?: "bottom" | "top";
	layout?: ListBoxHeights<T>;
	loadingState?: LoadingState;
	maxHeight?: number;
	name?: string;
	onLoadMore?: () => void;
	/** @default true */
	shouldFlip?: boolean;
	/** @default 'md' */
	size?: "md" | "sm";
}

export const SearchAutocomplete = forwardRef(function SearchAutocomplete<T extends object>(
	props: SearchAutocompleteProps<T>,
	forwardedRef: ForwardedRef<HTMLDivElement>,
): ReactNode {
	// const isMobile = useIsMobileDevice()

	// if (isMobile) {
	//   return <MobileSearchAutocomplete ref={forwardedRef} {...props} menuTrigger="input" />
	// } else {
	//   return <SearchAutocompleteBase ref={forwardedRef} {...props} />
	// }

	return <SearchAutocompleteBase ref={forwardedRef} {...props} />;
}) as <T extends object>(
	props: SearchAutocompleteProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => JSX.Element;

const SearchAutocompleteBase = forwardRef(function SearchAutocompleteBase<T extends object>(
	props: SearchAutocompleteProps<T>,
	forwardedRef: ForwardedRef<HTMLDivElement>,
): ReactNode {
	const {
		direction = "bottom",
		layout: _layout,
		loadingState,
		maxHeight,
		menuTrigger = "input",
		onLoadMore,
		onSubmit,
		shouldFlip = true,
	} = props;

	const { t } = useI18n<"common">();

	const isAsync = loadingState != null;
	const popoverRef = useRef<HTMLDivElement>(null);
	const listBoxRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	// TODO: Should be focusable ref.
	const fieldRef = useRef<HTMLDivElement>(null);

	const { contains } = useFilter({ sensitivity: "base" });
	const state = useComboBoxState<T>({
		...props,
		allowsCustomValue: true,
		allowsEmptyCollection: isAsync,
		defaultFilter: contains,
		defaultSelectedKey: undefined,
		onSelectionChange(key) {
			if (key != null) {
				// @ts-expect-error Error in upstream type definitions.
				onSubmit?.(null, key);
			}
		},
		selectedKey: undefined,
	});
	const layout = useListBoxLayout<T>(state, _layout);

	const { inputProps, listBoxProps, labelProps, clearButtonProps } = useSearchAutocomplete<T>(
		{
			...props,
			inputRef,
			keyboardDelegate: layout,
			listBoxRef,
			menuTrigger,
			popoverRef,
		},
		state,
	);

	const { overlayProps, placement, updatePosition } = useOverlayPosition({
		isOpen: state.isOpen,
		maxHeight,
		onClose: state.close,
		overlayRef: popoverRef,
		placement: `${direction} end` as Placement,
		scrollRef: listBoxRef,
		shouldFlip: shouldFlip,
		targetRef: inputRef,
	});

	const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

	const onResize = useCallback(() => {
		if (inputRef.current) {
			const inputWidth = inputRef.current.offsetWidth;
			setMenuWidth(inputWidth);
		}
	}, [inputRef, setMenuWidth]);

	useResizeObserver({ onResize, ref: fieldRef });

	useLayoutEffect(onResize, [onResize]);

	// Update position once the ListBox has rendered. This ensures that
	// it flips properly when it doesn't fit in the available space.
	// TODO: add ResizeObserver to useOverlayPosition so we don't need this.
	useLayoutEffect(() => {
		if (state.isOpen) {
			requestAnimationFrame(() => {
				updatePosition();
			});
		}
	}, [state.isOpen, updatePosition]);

	const style = {
		...overlayProps.style,
		minWidth: menuWidth,
		width: menuWidth,
	};

	const ref = useComposedRef(fieldRef, forwardedRef);

	return (
		<Fragment>
			<Field ref={ref} {...props} labelProps={labelProps}>
				<SearchAutocompleteInput
					{...props}
					clearButtonProps={clearButtonProps}
					inputProps={inputProps}
					inputRef={inputRef}
					isOpen={state.isOpen}
					loadingState={loadingState}
				/>
			</Field>
			<Popover
				ref={popoverRef}
				hideArrow
				isDismissable={false}
				isNonModal
				isOpen={state.isOpen}
				placement={placement}
				style={style}
			>
				<ListBoxBase<T>
					ref={listBoxRef}
					{...listBoxProps}
					autoFocus={state.focusStrategy}
					disallowEmptySelection
					focusOnPointerEnter
					isLoading={loadingState === "loading" || loadingState === "loadingMore"}
					layout={layout}
					onLoadMore={onLoadMore}
					renderEmptyState={() => {
						if (isAsync !== true) {
							return null;
						}

						return <span>{t(["common", "ui", "autocomplete", "no-results"])}</span>;
					}}
					shouldSelectOnPressUp
					shouldUseVirtualFocus
					state={state}
				/>
				<DismissButton
					onDismiss={() => {
						state.close();
					}}
				/>
			</Popover>
		</Fragment>
	);
}) as <T extends object>(
	props: SearchAutocompleteProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => JSX.Element;

interface SearchAutocompleteInputProps<T extends object> extends SearchAutocompleteProps<T> {
	clearButtonProps: AriaButtonProps;
	inputProps: InputHTMLAttributes<HTMLInputElement>;
	inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>;
	isOpen?: boolean;
}

const SearchAutocompleteInput = forwardRef(function SearchAutocompleteInput<T extends object>(
	props: SearchAutocompleteInputProps<T>,
	forwardedRef: ForwardedRef<HTMLDivElement>,
): ReactNode {
	const {
		clearButtonProps,
		isDisabled,
		isReadOnly,
		inputProps,
		inputRef,
		isOpen,
		loadingState,
		menuTrigger,
		size = "md",
		validationState,
	} = props;

	const { focusProps, isFocusVisible } = useFocusRing({
		...props,
		isTextInput: true,
		within: true,
	});
	const { hoverProps, isHovered } = useHover(props);
	const timeout = useRef<ReturnType<typeof window.setTimeout> | null>(null);
	const [showLoading, setShowLoading] = useState(false);

	const loadingCircle = <ProgressSpinner size="sm" />;

	const searchIcon = <Icon icon={MagnifierIcon} />;

	const clearButton = <ClearButton {...clearButtonProps} isDisabled={isDisabled} preventFocus />;

	const isLoading = loadingState === "loading" || loadingState === "filtering";
	const inputValue = inputProps.value;
	const lastInputValue = useRef(inputValue);

	// TODO: check this, also: same as in ComboBox
	useEffect(() => {
		if (isLoading && !showLoading) {
			if (timeout.current == null) {
				timeout.current = setTimeout(() => {
					setShowLoading(true);
				}, 500);
			}

			if (inputValue !== lastInputValue.current) {
				clearTimeout(timeout.current);
				timeout.current = setTimeout(() => {
					setShowLoading(true);
				}, 500);
			}
		} else if (!isLoading) {
			setShowLoading(false);
			if (timeout.current != null) {
				clearTimeout(timeout.current);
				timeout.current = null;
			}
		}

		lastInputValue.current = inputValue;
	}, [isLoading, showLoading, inputValue]);

	return (
		<div
			ref={forwardedRef}
			{...mergeProps(focusProps, hoverProps)}
			className={css["autocomplete-input-group"]}
			data-focused={isFocusVisible ? "" : undefined}
			data-hovered={isHovered ? "" : undefined}
		>
			<TextFieldBase
				icon={searchIcon}
				inputProps={inputProps}
				inputRef={inputRef}
				isDisabled={isDisabled}
				isLoading={
					// eslint-disable-next-line react/jsx-no-leaked-render
					showLoading && (isOpen === true || menuTrigger === "manual" || loadingState === "loading")
				}
				loadingIndicator={loadingState != null ? loadingCircle : undefined}
				size={size}
				validationState={validationState}
				wrapperChildren={inputValue !== "" && isReadOnly !== true ? clearButton : undefined}
			/>
		</div>
	);
}) as <T extends object>(
	props: SearchAutocompleteInputProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => JSX.Element;
