import css from "@/components/search/ModalDialog.module.css";

import type { ReactNode } from "react";
import {
	Dialog,
	Heading,
	Modal,
	ModalOverlay,
	type DialogProps,
	type ModalOverlayProps,
} from "react-aria-components";

export interface ModalDialogProps
	extends
		Pick<
			ModalOverlayProps,
			"isDismissable" | "isKeyboardDismissDisabled" | "isOpen" | "shouldCloseOnInteractOutside"
		>,
		Pick<DialogProps, "id" | "aria-label" | "aria-labelledby"> {
	title?: ReactNode;
	children?: ReactNode;
	onClose: () => void;
}

export function ModalDialog({
	id,
	title,
	children,
	onClose,
	...props
}: ModalDialogProps): ReactNode {
	const { "aria-label": ariaLabel, "aria-labelledby": labelledBy, ...overlayProps } = props;
	return (
		<ModalOverlay
			{...overlayProps}
			className={css["backdrop"]}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<Modal className={css["container"]}>
				<Dialog
					id={id}
					aria-label={ariaLabel}
					aria-labelledby={labelledBy}
					className={css["dialog"]}
				>
					{title != null ? (
						<Heading slot="title" level={2}>
							{title}
						</Heading>
					) : null}
					{children}
				</Dialog>
			</Modal>
		</ModalOverlay>
	);
}
