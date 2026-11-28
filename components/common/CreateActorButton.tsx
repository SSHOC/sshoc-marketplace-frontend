import { useTranslations } from "next-intl";
import { Fragment, type ReactNode, useState } from "react";
import { DialogTrigger } from "react-aria-components";

import type { ActorFormValues } from "@/components/common/ActorForm";
import { ActorForm } from "@/components/common/ActorForm";
import { useCreateActor } from "@/data/sshoc/hooks/actor";
import type { MutationMetadata } from "@/lib/core/query/types";
import { Button } from "@/lib/core/ui/Button/Button";
import { ButtonLink } from "@/lib/core/ui/Button/ButtonLink";
import { ModalDialog } from "@/lib/core/ui/ModalDialog/ModalDialog";

export interface CreateActorButtonProps {
	/** @default 'button' */
	variant?: "button-link" | "button";
}

export function CreateActorButton(props: CreateActorButtonProps): ReactNode {
	const { variant = "button" } = props;

	const [isOpen, setOpen] = useState(false);
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
		setOpen(false);
		createActor.mutate({ data: values });
	}

	function onCloseDialog() {
		setOpen(false);
	}

	return (
		<Fragment>
			<DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
				{variant === "button-link" ? (
					<ButtonLink>{t("authenticated.actors.create-actor")}</ButtonLink>
				) : (
					<Button color="gradient">{t("authenticated.actors.create-actor")}</Button>
				)}
				<ModalDialog
					isDismissable
					onClose={onCloseDialog}
					title={t("authenticated.actors.create-actor")}
				>
					<ActorForm name="create-actor" onCancel={onCloseDialog} onSubmit={onCreateActor} />
				</ModalDialog>
			</DialogTrigger>
		</Fragment>
	);
}
