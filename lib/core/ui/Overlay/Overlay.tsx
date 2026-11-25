import type { ForwardedRef } from "react";
import { forwardRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";

import { type OpenTransitionProps, OpenTransition } from "@/lib/core/ui/Overlay/OpenTransition";

export interface OverlayProps extends Omit<OpenTransitionProps, "in"> {
	isOpen?: boolean;
	container?: Element;
}

export const Overlay = forwardRef(function Overlay(
	props: OverlayProps,
	forwardedRef: ForwardedRef<HTMLDivElement>,
) {
	const {
		children,
		container,
		isOpen,
		nodeRef,
		onEnter,
		onEntering,
		onEntered,
		onExit,
		onExiting,
		onExited,
	} = props;
	const [exited, setExited] = useState(isOpen !== true);

	const handleEntered = useCallback(
		(isAppearing: boolean) => {
			setExited(false);
			if (onEntered) {
				onEntered(isAppearing);
			}
		},
		[onEntered],
	);

	const handleExited = useCallback(() => {
		setExited(true);
		if (onExited) {
			onExited();
		}
	}, [onExited]);

	const mountOverlay = isOpen === true || !exited;
	if (!mountOverlay) {
		return null;
	}

	const contents = (
		// TODO: Check if this should be a ModalProvider instead of div
		<div ref={forwardedRef} style={{ background: "transparent", isolation: "isolate" }}>
			<OpenTransition
				appear
				in={isOpen}
				nodeRef={nodeRef}
				onEnter={onEnter}
				onEntered={handleEntered}
				onEntering={onEntering}
				onExit={onExit}
				onExited={handleExited}
				onExiting={onExiting}
			>
				{children}
			</OpenTransition>
		</div>
	);

	return createPortal(contents, container || document.body);
});
