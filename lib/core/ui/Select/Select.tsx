import buttonCss from "@/lib/core/ui/FieldButton/FieldButton.module.css";
import listCss from "@/lib/core/ui/ListBox/ListBoxBase.module.css";
import css from "@/lib/core/ui/Select/Select.module.css";

import type { AriaSelectProps } from "@react-types/select";
import type { Alignment, LoadingState } from "@react-types/shared";
import { useTranslations } from "next-intl";
import type { ForwardedRef, KeyboardEvent, ReactNode } from "react";
import { forwardRef } from "react";
import {
	Button,
	Collection,
	ListBox,
	ListBoxLoadMoreItem,
	ListLayout,
	Popover,
	Select as AriaSelect,
	SelectValue,
	Virtualizer,
} from "react-aria-components";

import { AriaField } from "@/lib/core/ui/Field/AriaField";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import AlertIcon from "@/lib/core/ui/icons/alert";
import CheckmarkIcon from "@/lib/core/ui/icons/checkmark";
import ChevronIcon from "@/lib/core/ui/icons/chevron";
import type { ListBoxHeights } from "@/lib/core/ui/ListBox/useListBoxLayout";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";

export interface SelectProps<T extends object> extends Omit<
	AriaSelectProps<T>,
	"isLoading" | "errorMessage"
> {
	errorMessage?: ReactNode;
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
	layout?: ListBoxHeights;
	loadingState?: LoadingState;
	maxHeight?: number;
	onLoadMore?: () => void;
	shouldFlip?: boolean;
	/** @default 'md' */
	size?: "md" | "sm";
}

export const Select = forwardRef(function Select<T extends object>(
	props: SelectProps<T>,
	forwardedRef: ForwardedRef<HTMLDivElement>,
): ReactNode {
	const {
		align = "start",
		children,
		color = "primary",
		description,
		direction = "bottom",
		errorMessage,
		items,
		label,
		layout,
		loadingState,
		maxHeight,
		onLoadMore,
		placeholder,
		shouldFlip = true,
		size = "md",
		validationState,
		...selectProps
	} = props;
	const t = useTranslations();

	return (
		<AriaSelect<T>
			{...selectProps}
			ref={forwardedRef}
			className={css["select"]}
			isInvalid={props.isInvalid || validationState === "invalid"}
			validationBehavior="aria"
			placeholder={placeholder ?? t("common.ui.select.placeholder")}
		>
			{({ isOpen }) => (
				<AriaField
					{...props}
					label={label}
					description={description}
					errorMessage={errorMessage}
					includeNecessityIndicatorInAccessibilityName
				>
					<div
						className={css["select-input-group"]}
						data-open={isOpen}
						data-size={size}
						data-validation-state={validationState}
						data-loading-state={loadingState}
					>
						<Button
							className={buttonCss["button"]}
							data-color={color}
							data-validation-state={validationState}
						>
							<SelectValue className={css["select-value"]} />
							{loadingState === "loading" ? (
								<div className={css["validation-icon"]}>
									<ProgressSpinner size="sm" />
								</div>
							) : validationState ? (
								<div className={css["validation-icon"]}>
									<Icon icon={validationState === "invalid" ? AlertIcon : CheckmarkIcon} />
								</div>
							) : null}
							<Icon icon={ChevronIcon} />
						</Button>
					</div>
					<Popover
						className={css["popover"]}
						placement={`${direction} ${align}`}
						offset={6}
						maxHeight={maxHeight}
						shouldFlip={shouldFlip}
					>
						<div className={css["listbox-container"]} onKeyDownCapture={preventPageNavigation}>
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
								>
									<Collection items={items}>{children}</Collection>
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
						</div>
					</Popover>
				</AriaField>
			)}
		</AriaSelect>
	);
}) as <T extends object>(
	props: SelectProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReactNode;

function preventPageNavigation(event: KeyboardEvent) {
	// Aria moves focus for Home/End in toggle mode but also permits native page scrolling.
	if (event.key === "Home" || event.key === "End") event.preventDefault();
}
