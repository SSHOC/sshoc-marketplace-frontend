import { FocusScope, useFocusRing } from "@react-aria/focus";
import { useHover } from "@react-aria/interactions";
import { DismissButton, useOverlayPosition } from "@react-aria/overlays";
import { HiddenSelect, useSelect } from "@react-aria/select";
import { mergeProps, useLayoutEffect, useResizeObserver } from "@react-aria/utils";
import { useSelectState } from "@react-stately/select";
import type { Placement } from "@react-types/overlays";
import type { AriaSelectProps } from "@react-types/select";
import type { Alignment, LoadingState } from "@react-types/shared";
import { useTranslations } from "next-intl";
import type { ForwardedRef, ReactNode } from "react";
import { forwardRef, Fragment, useCallback, useRef, useState } from "react";
import useComposedRef from "use-composed-ref";

import { Field } from "@/lib/core/ui/Field/Field";
import { FieldButton } from "@/lib/core/ui/FieldButton/FieldButton";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import AlertIcon from "@/lib/core/ui/icons/alert.svg?symbol-icon";
import CheckmarkIcon from "@/lib/core/ui/icons/checkmark.svg?symbol-icon";
import ChevronIcon from "@/lib/core/ui/icons/chevron.svg?symbol-icon";
import { ListBoxBase } from "@/lib/core/ui/ListBox/ListBoxBase";
import type { ListBoxHeights } from "@/lib/core/ui/ListBox/useListBoxLayout";
import { useListBoxLayout } from "@/lib/core/ui/ListBox/useListBoxLayout";
import { Popover } from "@/lib/core/ui/Popover/Popover";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";
import css from "@/lib/core/ui/Select/Select.module.css";

export interface SelectProps<T extends object> extends Omit<AriaSelectProps<T>, "isLoading"> {
	/** @default 'start' */
	align?: Alignment;
	autoFocus?: boolean;
	/** @default 'primary' */
	color?: "form" | "primary";
	/** @default 'bottom' */
	direction?: "bottom" | "top";
	/**
	 * Intentionally omitted, because HTML allows `readonly` only on `input` and `textarea`,
	 * but not on `select`. We *could* use `aria-readonly`, which is allowed for role `listbox`
	 * and `combobox`, but does not work great with our current markup
	 * (button with `aria-haspopup="listbox"`).
	 */
	isReadOnly?: never;
	layout?: ListBoxHeights<T>;
	loadingState?: LoadingState;
	maxHeight?: number;
	/** @default 'md' */
	size?: "md" | "sm";
}

export const Select = forwardRef(function Select<T extends object>(
	props: SelectProps<T>,
	forwardedRef: ForwardedRef<HTMLDivElement>,
): ReactNode {
	return <SelectBase ref={forwardedRef} {...props} />;
}) as <T extends object>(
	props: SelectProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReactNode;

const SelectBase = forwardRef(function SelectBase<T extends object>(
	props: SelectProps<T>,
	forwardedRef: ForwardedRef<HTMLDivElement>,
): ReactNode {
	const {
		color = "primary",
		align = "start",
		autoComplete,
		autoFocus,
		direction = "bottom",
		isDisabled,
		label,
		layout: _layout,
		loadingState,
		maxHeight,
		name,
		shouldFlip = true,
		size = "md",
		validationState,
	} = props;

	const t = useTranslations();

	const state = useSelectState<T>(props);
	const popoverRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const listboxRef = useRef<HTMLDivElement>(null);
	const fieldRef = useRef<HTMLDivElement>(null);
	const ref = useComposedRef(fieldRef, forwardedRef);

	const layout = useListBoxLayout<T>(state, _layout);
	const { labelProps, triggerProps, valueProps, menuProps, descriptionProps, errorMessageProps } =
		useSelect<T>(
			{
				...props,
				keyboardDelegate: layout,
			},
			state,
			triggerRef,
		);

	const { overlayProps, placement, updatePosition } = useOverlayPosition({
		isOpen: state.isOpen,
		maxHeight,
		onClose: state.close,
		overlayRef: popoverRef,
		placement: `${direction} ${align}` as Placement,
		scrollRef: listboxRef,
		shouldFlip: shouldFlip,
		targetRef: triggerRef,
	});

	const { hoverProps, isHovered } = useHover(props);
	const { focusProps, isFocusVisible } = useFocusRing(props);

	const placeholder = props.placeholder ?? t("common.ui.select.placeholder");

	const isInvalid = validationState === "invalid";

	const listbox = (
		<FocusScope contain restoreFocus>
			<DismissButton
				onDismiss={() => {
					return state.close();
				}}
			/>
			<ListBoxBase<T>
				ref={listboxRef}
				{...menuProps}
				autoFocus={state.focusStrategy || true}
				color={color}
				disallowEmptySelection
				focusOnPointerEnter
				isLoading={loadingState === "loadingMore"}
				layout={layout}
				onLoadMore={props.onLoadMore}
				shouldSelectOnPressUp
				state={state}
			/>
			<DismissButton
				onDismiss={() => {
					return state.close();
				}}
			/>
		</FocusScope>
	);

	const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined);

	const onResize = useCallback(() => {
		if (triggerRef.current) {
			const width = triggerRef.current.offsetWidth;
			setButtonWidth(width);
		}
	}, [triggerRef, setButtonWidth]);

	useResizeObserver({ onResize, ref: triggerRef });

	useLayoutEffect(onResize, [state.selectedKey, onResize]);

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
		minWidth: buttonWidth,
		width: buttonWidth,
		// width: menuWidth ?? buttonWidth,
	};

	const overlay = (
		<Popover
			ref={popoverRef}
			hideArrow
			isOpen={state.isOpen}
			onClose={state.close}
			placement={placement}
			shouldCloseOnBlur
			style={style}
		>
			{listbox}
		</Popover>
	);

	const contents = (
		<span
			{...valueProps}
			className={css["select-value"]}
			data-placeholder={state.selectedItem == null ? "" : undefined}
		>
			{}
			{state.selectedItem != null ? state.selectedItem.rendered : placeholder}
		</span>
	);

	const loadingIndicator = <ProgressSpinner size="sm" />;

	const picker = (
		<Fragment>
			<div
				className={css["select-input-group"]}
				data-color={color}
				data-open={state.isOpen}
				data-active={state.isOpen === true ? "" : undefined}
				data-focused={isFocusVisible ? "" : undefined}
				data-hovered={isHovered ? "" : undefined}
				data-size={size}
				data-validation-state={validationState}
				data-loading-state={loadingState}
			>
				<HiddenSelect
					autoComplete={autoComplete}
					isDisabled={isDisabled}
					label={label}
					name={name}
					state={state}
					triggerRef={triggerRef}
				/>
				<FieldButton
					ref={triggerRef}
					{...mergeProps(focusProps, hoverProps, triggerProps)}
					autoFocus={autoFocus} // TODO: is this included in focusProps anyway?
					color={color}
					isActive={state.isOpen}
					isDisabled={isDisabled}
					// size={size}
					validationState={validationState}
				>
					{contents}
					{loadingState === "loading" ? (
						<div className={css["validation-icon"]}>{loadingIndicator}</div>
					) : validationState ? (
						<div className={css["validation-icon"]}>
							<Icon icon={isInvalid ? AlertIcon : CheckmarkIcon} />
						</div>
					) : null}

					<Icon icon={ChevronIcon} />
				</FieldButton>
			</div>
			{state.collection.size === 0 ? null : overlay}
		</Fragment>
	);

	return (
		<Field
			ref={ref}
			{...props}
			descriptionProps={descriptionProps}
			errorMessageProps={errorMessageProps}
			includeNecessityIndicatorInAccessibilityName
			labelElementType="span"
			labelProps={labelProps}
			showErrorIcon={false}
		>
			{picker}
		</Field>
	);
}) as <T extends object>(
	props: SelectProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReactNode;
