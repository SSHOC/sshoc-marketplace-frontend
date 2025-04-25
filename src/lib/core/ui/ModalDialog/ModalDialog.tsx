import { useDialog } from "@react-aria/dialog";
import { FocusScope } from "@react-aria/focus";
import type { OverlayProps as AriaOverlayProps } from "@react-aria/overlays";
import { OverlayContainer, useModal, useOverlay, usePreventScroll } from "@react-aria/overlays";
import { mergeProps } from "@react-aria/utils";
import type { AriaDialogProps } from "@react-types/dialog";
import type { CSSProperties, ReactNode } from "react";
import { useRef } from "react";

import { CloseButton } from "@/lib/core/ui/CloseButton/CloseButton";
import css from "@/lib/core/ui/ModalDialog/ModalDialog.module.css";
import { Underlay } from "@/lib/core/ui/Overlay/Underlay";

export interface ModalDialogStyleProps {
	"--dialog-min-width"?: CSSProperties["minWidth"];
}

export interface ModalDialogProps extends AriaOverlayProps, AriaDialogProps {
	children?: ReactNode;
	style?: ModalDialogStyleProps;
	title?: ReactNode;
}

export function ModalDialog(props: ModalDialogProps): ReactNode {
	const { children, isDismissable = false, isOpen, onClose, style, title } = props;

	const ref = useRef<HTMLDivElement>(null);
	const { overlayProps, underlayProps } = useOverlay(props, ref);
	usePreventScroll();
	const { modalProps } = useModal();
	const { dialogProps, titleProps } = useDialog(props, ref);

	// FIXME:
	// if (!isOpen) return null

	return (
		<OverlayContainer>
			<Underlay {...underlayProps} isOpen={isOpen} />
			<div className={css["container"]}>
				<FocusScope contain restoreFocus autoFocus>
					<section
						ref={ref}
						{...mergeProps(overlayProps, dialogProps, modalProps)}
						className={css["dialog"]}
						style={style as CSSProperties}
					>
						<header className={css["dialog-header"]}>
							<h2 {...titleProps} className={css["dialog-title"]} data-dialog-title>
								{title}
							</h2>
							{isDismissable ? (
								<div className={css["close-button"]}>
									<CloseButton onPress={onClose} />
								</div>
							) : null}
						</header>
						{children}
					</section>
				</FocusScope>
			</div>
		</OverlayContainer>
	);
}
