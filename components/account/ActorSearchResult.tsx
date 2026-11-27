import { useTranslations } from "next-intl";
import { Fragment, type ReactNode, useState } from "react";
import { DialogTrigger } from "react-aria-components";

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
import type { MutationMetadata } from "@/lib/core/query/types";
import { ButtonLink } from "@/lib/core/ui/Button/ButtonLink";
import { ModalDialog } from "@/lib/core/ui/ModalDialog/ModalDialog";

export interface ActorSearchResultProps {
	actor: SearchActors.Response["actors"][number];
}

export function ActorSearchResult(props: ActorSearchResultProps): ReactNode {
	const { actor } = props;

	const t = useTranslations();
	const [isOpen, setOpen] = useState(false);

	const deleteActorMeta: MutationMetadata = {
		messages: {
			mutate() {
				return t("authenticated.actors.delete-actor-pending");
			},
			success() {
				return t("authenticated.actors.delete-actor-success");
			},
			error() {
				return t("authenticated.actors.delete-actor-error");
			},
		},
	};
	const deleteActor = useDeleteActor({ id: actor.id }, undefined, { meta: deleteActorMeta });

	const updateActorMeta: MutationMetadata = {
		messages: {
			mutate() {
				return t("authenticated.actors.update-actor-pending");
			},
			success() {
				return t("authenticated.actors.update-actor-success");
			},
			error() {
				return t("authenticated.actors.update-actor-error");
			},
		},
	};
	const updateActor = useUpdateActor({ id: actor.id }, undefined, { meta: updateActorMeta });

	function onDeleteActor() {
		deleteActor.mutate();
	}

	function onUpdateActor(actor: ActorInput) {
		setOpen(false);
		updateActor.mutate({ data: actor });
	}

	function onCloseEditDialog() {
		setOpen(false);
	}

	return (
		<Fragment>
			<SearchResult>
				<SearchResultTitle>{actor.name}</SearchResultTitle>
				<SearchResultContent>
					<MetadataValues>
						{actor.email != null ? (
							<MetadataValue>
								<MetadataLabel>{t("authenticated.actors.email.label")}:</MetadataLabel>
								<a href={`mailto:${actor.email}`}>{actor.email}</a>
							</MetadataValue>
						) : null}
						{actor.website != null ? (
							<MetadataValue>
								<MetadataLabel>{t("authenticated.actors.website.label")}:</MetadataLabel>
								<a href={actor.website} target="_blank" rel="noreferrer">
									{actor.website}
								</a>
							</MetadataValue>
						) : null}
						{Array.isArray(actor.affiliations) && actor.affiliations.length > 0 ? (
							<MetadataValue>
								<MetadataLabel>{t("authenticated.actors.affiliations.label")}:</MetadataLabel>
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
							aria-label={t("authenticated.actors.delete-actor", {
								name: actor.name,
							})}
							onPress={onDeleteActor}
						>
							{t("authenticated.controls.delete")}
						</ButtonLink>
					</AccessControl>
					<DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
						<ButtonLink
							aria-label={t("authenticated.actors.edit-actor", {
								name: actor.name,
							})}
						>
							{t("authenticated.controls.edit")}
						</ButtonLink>
						<ModalDialog
							isDismissable
							onClose={onCloseEditDialog}
							title={t("authenticated.actors.edit-actor-dialog-title")}
						>
							<ActorForm
								initialValues={actor}
								name="edit-actor"
								onCancel={onCloseEditDialog}
								onSubmit={onUpdateActor}
							/>
						</ModalDialog>
					</DialogTrigger>
				</SearchResultControls>
			</SearchResult>
		</Fragment>
	);
}
