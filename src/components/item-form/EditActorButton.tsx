import { Fragment, type ReactNode, useRef } from "react";

import type { ActorFormValues } from "@/components/common/ActorForm";
import { ActorForm } from "@/components/common/ActorForm";
import { FormRecordEditButton } from "@/components/common/FormRecordEditButton";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import type { Actor, ActorRef } from "@/data/sshoc/api/actor";
import { useActor, useUpdateActor } from "@/data/sshoc/hooks/actor";
import { useFieldState } from "@/lib/core/form/useFieldState";
import { useI18n } from "@/lib/core/i18n/useI18n";
import type { MutationMetadata } from "@/lib/core/query/types";
import { ModalDialog } from "@/lib/core/ui/ModalDialog/ModalDialog";
import { useModalDialogTriggerState } from "@/lib/core/ui/ModalDialog/useModalDialogState";
import { useModalDialogTrigger } from "@/lib/core/ui/ModalDialog/useModalDialogTrigger";

export interface EditActorButtonProps {
	field: ItemFormFields["fields"]["contributors"]["fields"]["actor"];
}

export function EditActorButton(props: EditActorButtonProps): ReactNode {
	const { field } = props;

	const actorId = useFieldState<ActorRef["id"] | undefined>(field.name).input.value;
	// TODO: Reuse initialValues / actor search result. Need to save full actor search result
	// in form state in ActorComboBox#onSelectionChange; then get it from useField(actorField._root)

	const actor = useActor({ id: actorId! }, undefined, { enabled: actorId != null });

	if (actorId == null || actor.data == null) {
		return null;
	}

	return <EditActorDialogTrigger actor={actor.data} field={field} />;
}

interface EditActorDialogTriggerProps {
	field: ItemFormFields["fields"]["contributors"]["fields"]["actor"];
	actor: Actor;
}

function EditActorDialogTrigger(props: EditActorDialogTriggerProps): ReactNode {
	const { actor, field } = props;

	const dialog = useModalDialogTriggerState({});
	const triggerRef = useRef<HTMLButtonElement>(null);
	const { triggerProps, overlayProps } = useModalDialogTrigger(
		{ type: "dialog" },
		dialog,
		triggerRef,
	);
	const { t } = useI18n<"authenticated">();
	const meta: MutationMetadata = {
		messages: {
			mutate() {
				return t(["authenticated", "actors", "update-actor-pending"]);
			},
			success() {
				return t(["authenticated", "actors", "update-actor-success"]);
			},
			error() {
				return t(["authenticated", "actors", "update-actor-error"]);
			},
		},
	};
	const updateActor = useUpdateActor({ id: actor.id }, undefined, { meta });

	function onUpdateActor(values: ActorFormValues) {
		dialog.close();
		updateActor.mutate({ data: values });
	}

	function onOpenDialog() {
		dialog.open();
	}

	function onCloseDialog() {
		dialog.close();
	}

	return (
		<Fragment>
			<FormRecordEditButton
				ref={triggerRef}
				{...triggerProps}
				aria-label={t(["authenticated", "forms", "edit-field"], {
					values: { field: field.itemLabel },
				})}
				onPress={onOpenDialog}
			>
				{t(["authenticated", "controls", "edit"])}
			</FormRecordEditButton>
			{dialog.isOpen ? (
				<ModalDialog
					{...(overlayProps as any)}
					isDismissable
					isOpen={dialog.isOpen}
					onClose={onCloseDialog}
					title={t(["authenticated", "actors", "create-actor"])}
				>
					<ActorForm
						initialValues={actor}
						name="create-actor"
						onCancel={onCloseDialog}
						onSubmit={onUpdateActor}
					/>
				</ModalDialog>
			) : null}
		</Fragment>
	);
}
