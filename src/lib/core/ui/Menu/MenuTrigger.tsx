import { FocusScope } from "@react-aria/focus";
import { useMenuTrigger } from "@react-aria/menu";
import { DismissButton, useOverlayPosition } from "@react-aria/overlays";
import { useLayoutEffect, useResizeObserver } from "@react-aria/utils";
import { useMenuTriggerState } from "@react-stately/menu";
import type { MenuTriggerProps as AriaMenuTriggerProps } from "@react-types/menu";
import type { Placement } from "@react-types/overlays";
import type { ForwardedRef, ReactNode } from "react";
import { forwardRef, Fragment, useCallback, useRef, useState } from "react";
import useComposedRef from "use-composed-ref";

import type { ButtonProps } from "@/lib/core/ui/Button/Button";
import { Button } from "@/lib/core/ui/Button/Button";
// import { useIsMobileDevice } from '@/lib/core/ui/hooks/useIsMobileDevice'
import { MenuContext } from "@/lib/core/ui/Menu/MenuContext";
import { Popover } from "@/lib/core/ui/Popover/Popover";

export interface MenuTriggerProps
	extends AriaMenuTriggerProps,
		Pick<ButtonProps, "color" | "style" | "variant"> {
	label?: ReactNode;
	children?: ReactNode;
}

export const MenuTrigger = forwardRef(function MenuTrigger(
	props: MenuTriggerProps,
	forwardedRef: ForwardedRef<HTMLElement>,
): JSX.Element {
	const {
		children,
		align = "start",
		color,
		style: buttonStyle,
		variant,
		label,
		shouldFlip = true,
		direction = "bottom",
		closeOnSelect,
		trigger = "press",
	} = props;

	const menuPopoverRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLElement>(null);
	const menuRef = useRef<HTMLUListElement>(null);
	const ref = useComposedRef(triggerRef, forwardedRef);

	const state = useMenuTriggerState(props);

	const { menuTriggerProps, menuProps } = useMenuTrigger({ trigger }, state, triggerRef);

	let initialPlacement: Placement;
	switch (direction) {
		case "left":
		case "right":
		case "start":
		case "end":
			initialPlacement = `${direction} ${align === "end" ? "bottom" : "top"}` as Placement;
			break;
		case "bottom":
		case "top":
		default:
			initialPlacement = `${direction} ${align}` as Placement;
	}

	// const isMobile = useIsMobileDevice()

	const { overlayProps, placement, updatePosition } = useOverlayPosition({
		targetRef: triggerRef,
		overlayRef: menuPopoverRef,
		scrollRef: menuRef,
		placement: initialPlacement,
		shouldFlip: shouldFlip,
		isOpen: state.isOpen,
		onClose: state.close,
	});

	const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

	const onResize = useCallback(() => {
		if (triggerRef.current) {
			const buttonWidth = triggerRef.current.offsetWidth;
			setMenuWidth(buttonWidth);
		}
	}, [triggerRef, setMenuWidth]);

	useResizeObserver({ onResize, ref: triggerRef });

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

	const menuContext = {
		...menuProps,
		ref: menuRef,
		onClose: state.close,
		closeOnSelect,
		autoFocus: state.focusStrategy || true,
	};

	const contents = (
		<FocusScope restoreFocus>
			<DismissButton onDismiss={state.close} />
			{children}
			<DismissButton onDismiss={state.close} />
		</FocusScope>
	);

	return (
		<Fragment>
			<Button
				ref={ref}
				{...menuTriggerProps}
				color={color}
				isPressed={state.isOpen}
				style={buttonStyle}
				variant={variant}
				trigger={state.isOpen ? "expanded" : "collapsed"}
			>
				{label}
			</Button>
			<MenuContext.Provider value={menuContext}>
				<Popover
					ref={menuPopoverRef}
					isOpen={state.isOpen}
					style={style}
					placement={placement}
					hideArrow
					onClose={state.close}
					shouldCloseOnBlur
				>
					{contents}
				</Popover>
			</MenuContext.Provider>
		</Fragment>
	);
});
