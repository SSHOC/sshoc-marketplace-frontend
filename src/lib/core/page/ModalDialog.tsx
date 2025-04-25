import { useDialog } from "@react-aria/dialog";
import { FocusScope } from "@react-aria/focus";
import type { OverlayProps } from "@react-aria/overlays";
import { useModal, useOverlay, usePreventScroll } from "@react-aria/overlays";
import type { AriaDialogProps } from "@react-types/dialog";
import type { ReactNode } from "react";
import { useRef } from "react";

import css from "@/lib/core/page/ModalDialog.module.css";

export interface ModalDialogProps extends OverlayProps, AriaDialogProps {
	title?: ReactNode;
	children?: ReactNode;
}

export function ModalDialog(props: ModalDialogProps): JSX.Element {
	const ref = useRef<HTMLDivElement>(null);
	const { overlayProps, underlayProps } = useOverlay(props, ref);
	usePreventScroll();
	const { modalProps } = useModal();
	const { dialogProps, titleProps } = useDialog(props, ref);

	return (
		<div className={css["backdrop"]} {...underlayProps}>
			<FocusScope contain restoreFocus autoFocus>
				<div
					{...overlayProps}
					{...dialogProps}
					{...modalProps}
					ref={ref}
					className={css["container"]}
				>
					{props.title != null ? <h2 {...titleProps}>{props.title}</h2> : null}
					{props.children}
				</div>
			</FocusScope>
		</div>
	);
}
