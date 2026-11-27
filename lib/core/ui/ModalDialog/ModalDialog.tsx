import css from "@/lib/core/ui/ModalDialog/ModalDialog.module.css";

import type { CSSProperties, ReactNode } from "react";
import {
	Dialog,
	Heading,
	Modal,
	ModalOverlay,
	type DialogProps,
	type ModalOverlayProps,
} from "react-aria-components";

import { CloseButton } from "@/lib/core/ui/CloseButton/CloseButton";

export interface ModalDialogStyleProps {
	"--dialog-min-width"?: CSSProperties["minWidth"];
}

export interface ModalDialogProps
	extends
		Pick<
			ModalOverlayProps,
			"isDismissable" | "isKeyboardDismissDisabled" | "isOpen" | "shouldCloseOnInteractOutside"
		>,
		Pick<DialogProps, "id" | "aria-label" | "aria-labelledby"> {
	children?: ReactNode;
	style?: ModalDialogStyleProps;
	title?: ReactNode;
	onClose?: () => void;
}

export function ModalDialog(props: ModalDialogProps): ReactNode {
	const {
		children,
		id,
		"aria-label": ariaLabel,
		"aria-labelledby": labelledBy,
		isDismissable = false,
		onClose,
		style,
		title,
		...overlayProps
	} = props;

	return (
		<ModalOverlay
			{...overlayProps}
			className={css["container"]}
			isDismissable={isDismissable}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose?.();
			}}
		>
			<Modal className={css["modal"]} style={style as CSSProperties}>
				<Dialog
					id={id}
					aria-label={ariaLabel}
					aria-labelledby={labelledBy}
					className={css["dialog"]}
				>
					<header className={css["dialog-header"]}>
						<Heading level={2} slot="title" className={css["dialog-title"]} data-dialog-title>
							{title}
						</Heading>
						{isDismissable ? (
							<div className={css["close-button"]}>
								<CloseButton onPress={onClose} />
							</div>
						) : null}
					</header>
					{children}
				</Dialog>
			</Modal>
		</ModalOverlay>
	);
}
