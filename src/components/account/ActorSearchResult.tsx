import { Fragment, useRef } from "react";

import { ActorForm } from "@/components/common/ActorForm";
import { MetadataLabel } from "@/components/common/MetadataLabel";
import { MetadataValue } from "@/components/common/MetadataValue";
import { MetadataValues } from "@/components/common/MetadataValues";
import { SearchResult } from "@/components/common/SearchResult";
import { SearchResultContent } from "@/components/common/SearchResultContent";
import { SearchResultControls } from "@/components/common/SearchResultControls";
import { SearchResultTitle } from "@/components/common/SearchResultTitle";
import type { ActorInput, SearchActors } from "@/data/sshoc/api/actor";
import { useDeleteActor, useUpdateActor } from "@/data/sshoc/hooks/actor";
import { AccessControl } from "@/lib/core/auth/AccessControl";
import { useI18n } from "@/lib/core/i18n/useI18n";
import type { MutationMetadata } from "@/lib/core/query/types";
import { ButtonLink } from "@/lib/core/ui/Button/ButtonLink";
import { ModalDialog } from "@/lib/core/ui/ModalDialog/ModalDialog";
import { useModalDialogTriggerState } from "@/lib/core/ui/ModalDialog/useModalDialogState";
import { useModalDialogTrigger } from "@/lib/core/ui/ModalDialog/useModalDialogTrigger";

export interface ActorSearchResultProps {
	actor: SearchActors.Response["actors"][number];
}

export function ActorSearchResult(props: ActorSearchResultProps): JSX.Element {
	const { actor } = props;

	const { t } = useI18n<"authenticated" | "common">();
	const dialog = useModalDialogTriggerState({});
	const triggerRef = useRef<HTMLButtonElement>(null);
	const { triggerProps, overlayProps } = useModalDialogTrigger(
		{ type: "dialog" },
		dialog,
		triggerRef,
	);

	const deleteActorMeta: MutationMetadata = {
		messages: {
			mutate() {
				return t(["authenticated", "actors", "delete-actor-pending"]);
			},
			success() {
				return t(["authenticated", "actors", "delete-actor-success"]);
			},
			error() {
				return t(["authenticated", "actors", "delete-actor-error"]);
			},
		},
	};
	const deleteActor = useDeleteActor({ id: actor.id }, undefined, { meta: deleteActorMeta });

	const updateActorMeta: MutationMetadata = {
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
	const updateActor = useUpdateActor({ id: actor.id }, undefined, { meta: updateActorMeta });

	function onDeleteActor() {
		deleteActor.mutate();
	}

	function onUpdateActor(actor: ActorInput) {
		dialog.close();
		updateActor.mutate({ data: actor });
	}

	function onCloseEditDialog() {
		dialog.close();
	}

	function onOpenEditDialog() {
		dialog.open();
	}

	return (
		<Fragment>
			<SearchResult>
				<SearchResultTitle>{actor.name}</SearchResultTitle>
				<SearchResultContent>
					<MetadataValues>
						{actor.email != null ? (
							<MetadataValue>
								<MetadataLabel>{t(["authenticated", "actors", "email", "label"])}:</MetadataLabel>
								<a href={`mailto:${actor.email}`}>{actor.email}</a>
							</MetadataValue>
						) : null}
						{actor.website != null ? (
							<MetadataValue>
								<MetadataLabel>{t(["authenticated", "actors", "website", "label"])}:</MetadataLabel>
								<a href={actor.website} target="_blank" rel="noreferrer">
									{actor.website}
								</a>
							</MetadataValue>
						) : null}
						{Array.isArray(actor.affiliations) && actor.affiliations.length > 0 ? (
							<MetadataValue>
								<MetadataLabel>
									{t(["authenticated", "actors", "affiliations", "label"])}:
								</MetadataLabel>
								<span>
									{actor.affiliations
										.map((actor) => {
											return actor.name;
										})
										.join(", ")}
								</span>
							</MetadataValue>
						) : null}
					</MetadataValues>
				</SearchResultContent>
				<SearchResultControls>
					<AccessControl roles={["administrator"]}>
						<ButtonLink
							aria-label={t(["authenticated", "actors", "delete-actor"], {
								values: { name: actor.name },
							})}
							onPress={onDeleteActor}
						>
							{t(["authenticated", "controls", "delete"])}
						</ButtonLink>
					</AccessControl>
					<ButtonLink
						ref={triggerRef}
						{...triggerProps}
						aria-label={t(["authenticated", "actors", "edit-actor"], {
							values: { name: actor.name },
						})}
						onPress={onOpenEditDialog}
					>
						{t(["authenticated", "controls", "edit"])}
					</ButtonLink>
				</SearchResultControls>
			</SearchResult>
			{dialog.isOpen ? (
				<ModalDialog
					{...(overlayProps as any)}
					isDismissable
					isOpen={dialog.isOpen}
					onClose={onCloseEditDialog}
					title={t(["authenticated", "actors", "edit-actor-dialog-title"])}
				>
					<ActorForm
						initialValues={actor}
						name="edit-actor"
						onCancel={onCloseEditDialog}
						onSubmit={onUpdateActor}
					/>
				</ModalDialog>
			) : null}
		</Fragment>
	);
}
