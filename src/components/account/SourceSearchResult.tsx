import { Fragment, useRef } from "react";

import { SourceForm } from "@/components/account/SourceForm";
import { MetadataLabel } from "@/components/common/MetadataLabel";
import { MetadataValue } from "@/components/common/MetadataValue";
import { SearchResult } from "@/components/common/SearchResult";
import { SearchResultContent } from "@/components/common/SearchResultContent";
import { SearchResultControls } from "@/components/common/SearchResultControls";
import { SearchResultMeta } from "@/components/common/SearchResultMeta";
import { SearchResultTitle } from "@/components/common/SearchResultTitle";
import { Timestamp } from "@/components/common/Timestamp";
import type { GetSources, SourceInput } from "@/data/sshoc/api/source";
import { useDeleteSource, useUpdateSource } from "@/data/sshoc/hooks/source";
import { useI18n } from "@/lib/core/i18n/useI18n";
import type { MutationMetadata } from "@/lib/core/query/types";
import { ButtonLink } from "@/lib/core/ui/Button/ButtonLink";
import { ModalDialog } from "@/lib/core/ui/ModalDialog/ModalDialog";
import { useModalDialogTriggerState } from "@/lib/core/ui/ModalDialog/useModalDialogState";
import { useModalDialogTrigger } from "@/lib/core/ui/ModalDialog/useModalDialogTrigger";

export interface SourceSearchResultProps {
	source: GetSources.Response["sources"][number];
}

export function SourceSearchResult(props: SourceSearchResultProps): JSX.Element {
	const { source } = props;

	const { t } = useI18n<"authenticated" | "common">();
	const dialog = useModalDialogTriggerState({});
	const triggerRef = useRef<HTMLButtonElement>(null);
	const { triggerProps, overlayProps } = useModalDialogTrigger(
		{ type: "dialog" },
		dialog,
		triggerRef,
	);

	const deleteSourceMeta: MutationMetadata = {
		messages: {
			mutate() {
				return t(["authenticated", "sources", "delete-source-pending"]);
			},
			success() {
				return t(["authenticated", "sources", "delete-source-success"]);
			},
			error() {
				return t(["authenticated", "sources", "delete-source-error"]);
			},
		},
	};
	const deleteSource = useDeleteSource({ id: source.id }, undefined, { meta: deleteSourceMeta });

	const updateSourceMeta: MutationMetadata = {
		messages: {
			mutate() {
				return t(["authenticated", "sources", "update-source-pending"]);
			},
			success() {
				return t(["authenticated", "sources", "update-source-success"]);
			},
			error() {
				return t(["authenticated", "sources", "update-source-error"]);
			},
		},
	};
	const updateSource = useUpdateSource({ id: source.id }, undefined, { meta: updateSourceMeta });

	function onDeleteSource() {
		deleteSource.mutate();
	}

	function onUpdateSource(source: SourceInput) {
		dialog.close();
		updateSource.mutate({ data: source });
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
				<SearchResultTitle>{source.label}</SearchResultTitle>
				<SearchResultMeta>
					{source.lastHarvestedDate != null ? (
						<MetadataValue size="sm">
							<MetadataLabel size="sm">
								{t(["authenticated", "sources", "last-harvest-date"])}:
							</MetadataLabel>
							<Timestamp dateTime={source.lastHarvestedDate} />
						</MetadataValue>
					) : null}
				</SearchResultMeta>
				<SearchResultContent>
					<MetadataValue>
						<MetadataLabel>{t(["authenticated", "sources", "source-url"])}:</MetadataLabel>
						<a href={source.url} rel="noreferrer" target="_blank">
							{source.url}
						</a>
					</MetadataValue>
				</SearchResultContent>
				<SearchResultControls>
					<ButtonLink
						aria-label={t(["authenticated", "sources", "delete-source"], {
							values: { label: source.label },
						})}
						onPress={onDeleteSource}
					>
						{t(["authenticated", "controls", "delete"])}
					</ButtonLink>
					<ButtonLink
						ref={triggerRef}
						{...triggerProps}
						aria-label={t(["authenticated", "sources", "edit-source"], {
							values: { label: source.label },
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
					title={t(["authenticated", "sources", "edit-source-dialog-title"])}
				>
					<SourceForm
						initialValues={source}
						name="edit-source"
						onCancel={onCloseEditDialog}
						onSubmit={onUpdateSource}
					/>
				</ModalDialog>
			) : null}
		</Fragment>
	);
}
