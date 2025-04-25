import { useModal, useOverlay } from "@react-aria/overlays";
import { mergeProps, useLayoutEffect } from "@react-aria/utils";
import type { Axis, PopoverProps as AriaPopoverProps } from "@react-types/overlays";
import type { CSSProperties, ForwardedRef, SVGProps } from "react";
import { forwardRef, useRef, useState } from "react";
import useComposedRef from "use-composed-ref";

import type { TransitionStatus } from "@/lib/core/ui/Overlay/OpenTransition";
import { Overlay } from "@/lib/core/ui/Overlay/Overlay";
import css from "@/lib/core/ui/Popover/Popover.module.css";

export interface PopoverProps extends AriaPopoverProps {
	// TODO: should be positionStyle
	style?: CSSProperties;
}

export const Popover = forwardRef(function Popover(
	props: PopoverProps,
	forwardedRef: ForwardedRef<HTMLDivElement>,
): JSX.Element {
	const {
		arrowProps,
		children,
		hideArrow,
		isDismissable = true,
		isKeyboardDismissDisabled,
		isNonModal,
		onClose,
		placement,
		shouldCloseOnBlur,
		style,
		// TODO: what other props are there?
		...otherProps
	} = props;
	return (
		<Overlay {...otherProps} nodeRef={forwardedRef}>
			<PopoverWrapper
				ref={forwardedRef}
				arrowProps={arrowProps}
				hideArrow={hideArrow}
				isDismissable={isDismissable}
				isKeyboardDismissDisabled={isKeyboardDismissDisabled}
				isNonModal={isNonModal}
				onClose={onClose}
				placement={placement}
				shouldCloseOnBlur={shouldCloseOnBlur}
				style={style}
			>
				{children}
			</PopoverWrapper>
		</Overlay>
	);
});

const arrowPlacement: Record<Axis, Axis> = {
	bottom: "bottom",
	left: "right",
	right: "right",
	top: "bottom",
};

interface PopoverWrapperProps
	extends Pick<
		PopoverProps,
		| "arrowProps"
		| "children"
		| "hideArrow"
		| "isDismissable"
		| "isKeyboardDismissDisabled"
		| "isNonModal"
		| "isOpen"
		| "onClose"
		| "placement"
		| "shouldCloseOnBlur"
		| "style"
	> {
	transitionState?: TransitionStatus;
}

const PopoverWrapper = forwardRef(function PopoverWrapper(
	props: PopoverWrapperProps,
	forwardedRef: ForwardedRef<HTMLDivElement>,
) {
	const {
		arrowProps,
		children,
		hideArrow,
		isDismissable = true,
		/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
		isKeyboardDismissDisabled,
		isNonModal,
		isOpen,
		placement = "bottom",
		/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
		shouldCloseOnBlur,
		transitionState,
		...otherProps
	} = props;
	const popoverRef = useRef<HTMLDivElement>(null);
	const { overlayProps } = useOverlay(
		{ ...props, isDismissable: isDismissable && isOpen },
		popoverRef,
	);
	const { modalProps } = useModal({ isDisabled: isNonModal });

	const ref = useComposedRef(popoverRef, forwardedRef);

	return (
		<div
			ref={ref}
			{...mergeProps(otherProps, overlayProps, modalProps)}
			className={css["popover"]}
			data-open={isOpen}
			data-placement={placement}
			data-transition-state={transitionState}
			role="presentation"
		>
			{children}
			{hideArrow !== true && placement !== "center" ? (
				<Arrow arrowProps={arrowProps} direction={arrowPlacement[placement]} />
			) : null}
		</div>
	);
});

const ROOT_2 = Math.sqrt(2);

interface ArrowProps {
	arrowProps?: PopoverProps["arrowProps"];
	direction: Axis;
}

function Arrow(props: ArrowProps): JSX.Element {
	const [size, setSize] = useState(20);
	const [borderWidth, setBorderWidth] = useState(1);
	const ref = useRef<SVGSVGElement>(null);

	useLayoutEffect(() => {
		if (ref.current) {
			const arrowWidth = window
				.getComputedStyle(ref.current)
				.getPropertyValue("--popover-arrow-size");
			if (arrowWidth !== "") {
				setSize(parseInt(arrowWidth, 10) / 2);
			}

			const arrowBorderWidth = window
				.getComputedStyle(ref.current)
				.getPropertyValue("--popover-arrow-border-width");
			if (arrowBorderWidth !== "") {
				setBorderWidth(parseInt(arrowBorderWidth, 10));
			}
		}
	}, [ref]);

	const landscape = props.direction === "top" || props.direction === "bottom";
	const mirror = props.direction === "left" || props.direction === "top";

	const borderDiagonal = borderWidth * ROOT_2;
	const halfBorderDiagonal = borderDiagonal / 2;

	const secondary = 2 * size + 2 * borderDiagonal;
	const primary = size + borderDiagonal;

	const primaryStart = mirror ? primary : 0;
	const primaryEnd = mirror ? halfBorderDiagonal : primary - halfBorderDiagonal;

	const secondaryStart = halfBorderDiagonal;
	const secondaryMiddle = secondary / 2;
	const secondaryEnd = secondary - halfBorderDiagonal;

	const pathData = landscape
		? [
				"M",
				secondaryStart,
				primaryStart,
				"L",
				secondaryMiddle,
				primaryEnd,
				"L",
				secondaryEnd,
				primaryStart,
			]
		: [
				"M",
				primaryStart,
				secondaryStart,
				"L",
				primaryEnd,
				secondaryMiddle,
				"L",
				primaryStart,
				secondaryEnd,
			];
	const arrowProps = props.arrowProps;

	return (
		<svg
			ref={ref}
			height={Math.ceil(landscape ? primary : secondary)}
			width={Math.ceil(landscape ? secondary : primary)}
			{...(arrowProps as SVGProps<SVGSVGElement>)}
		>
			<path d={pathData.join(" ")} />
		</svg>
	);
}
