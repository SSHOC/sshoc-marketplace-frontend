import { useTranslations } from "next-intl";
import { Fragment, type ReactNode, useRef } from "react";

import type { ActorFormValues } from "@/components/common/ActorForm";
import { ActorForm } from "@/components/common/ActorForm";
import { useCreateActor } from "@/data/sshoc/hooks/actor";
import type { MutationMetadata } from "@/lib/core/query/types";
import { Button } from "@/lib/core/ui/Button/Button";
import { ButtonLink } from "@/lib/core/ui/Button/ButtonLink";
import { ModalDialog } from "@/lib/core/ui/ModalDialog/ModalDialog";
import { useModalDialogTriggerState } from "@/lib/core/ui/ModalDialog/useModalDialogState";
import { useModalDialogTrigger } from "@/lib/core/ui/ModalDialog/useModalDialogTrigger";

export interface CreateActorButtonProps {
	/** @default 'button' */
	variant?: "button-link" | "button";
}

export function CreateActorButton(props: CreateActorButtonProps): ReactNode {
	const { variant = "button" } = props;

	const dialog = useModalDialogTriggerState({});
	const triggerRef = useRef<HTMLButtonElement>(null);
	const { triggerProps, overlayProps } = useModalDialogTrigger(
		{ type: "dialog" },
		dialog,
		triggerRef,
	);
	const t = useTranslations();
	const meta: MutationMetadata = {
		messages: {
			mutate() {
				return t("authenticated.actors.create-actor-pending");
			},
			success() {
				return t("authenticated.actors.create-actor-success");
			},
			error() {
				return t("authenticated.actors.create-actor-error");
			},
		},
	};
	const createActor = useCreateActor(undefined, { meta });

	function onCreateActor(values: ActorFormValues) {
		dialog.close();
		createActor.mutate({ data: values });
	}

	function onOpenDialog() {
		dialog.open();
	}

	function onCloseDialog() {
		dialog.close();
	}

	return (
		<Fragment>
			{variant === "button-link" ? (
				<ButtonLink ref={triggerRef} {...triggerProps} onPress={onOpenDialog}>
					{t("authenticated.actors.create-actor")}
				</ButtonLink>
			) : (
				<Button ref={triggerRef} {...triggerProps} color="gradient" onPress={onOpenDialog}>
					{t("authenticated.actors.create-actor")}
				</Button>
			)}
			{dialog.isOpen ? (
				<ModalDialog
					{...(overlayProps as any)}
					isDismissable
					isOpen={dialog.isOpen}
					onClose={onCloseDialog}
					title={t("authenticated.actors.create-actor")}
				>
					<ActorForm name="create-actor" onCancel={onCloseDialog} onSubmit={onCreateActor} />
				</ModalDialog>
			) : null}
		</Fragment>
	);
}
