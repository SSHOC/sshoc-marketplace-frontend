import { useRef } from "react";
import { useForm } from "react-final-form";

import { FormFieldArray } from "@/components/common/FormFieldArray";
import { FormFieldArrayControls } from "@/components/common/FormFieldArrayControls";
import formFieldListCss from "@/components/common/FormFieldList.module.css";
import formFieldListItemCss from "@/components/common/FormFieldListItem.module.css";
import { FormFieldListItemControls } from "@/components/common/FormFieldListItemControls";
import { FormRecordAddButton } from "@/components/common/FormRecordAddButton";
import { FormRecordRemoveButton } from "@/components/common/FormRecordRemoveButton";
import { MediaUploadForm } from "@/components/item-form/MediaUploadForm";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import { useSubmitMediaUploadForm } from "@/components/item-form/useSubmitMediaUploadForm";
import type { ItemMediaInput } from "@/data/sshoc/api/item";
import { FormThumbnail } from "@/lib/core/form/FormThumbnail";
import { useFieldState } from "@/lib/core/form/useFieldState";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { ModalDialog } from "@/lib/core/ui/ModalDialog/ModalDialog";
import { useModalDialogTriggerState } from "@/lib/core/ui/ModalDialog/useModalDialogState";
import { useModalDialogTrigger } from "@/lib/core/ui/ModalDialog/useModalDialogTrigger";

export interface ThumbnailFormFieldProps {
	field: ItemFormFields["fields"]["thumbnail"];
}

export function ThumbnailFormField(props: ThumbnailFormFieldProps): JSX.Element {
	const { field } = props;

	const { t } = useI18n<"authenticated" | "common">();
	const form = useForm();
	const dialog = useModalDialogTriggerState({});
	const triggerRef = useRef<HTMLButtonElement>(null);
	const { triggerProps, overlayProps } = useModalDialogTrigger(
		{ type: "dialog" },
		dialog,
		triggerRef,
	);

	function onCloseDialog() {
		dialog.close();
	}

	function onOpenDialog() {
		dialog.open();
	}

	function onAdd(data: ItemMediaInput) {
		form.change(field.name, data);
	}

	const onSubmit = useSubmitMediaUploadForm({
		onClose() {
			dialog.close();
		},
		onSuccess(data: ItemMediaInput) {
			onAdd(data);
		},
	});

	function onRemove() {
		form.change(field.name, undefined);
	}

	const thumbnail = useFieldState<ItemMediaInput | undefined>(field.name).input.value;

	return (
		<FormFieldArray>
			<div className={formFieldListCss["list"]} data-variant="thumbnails">
				<div className={formFieldListItemCss["list-item"]}>
					<FormThumbnail {...field} />
					<FormFieldListItemControls>
						{thumbnail != null ? (
							<FormRecordRemoveButton
								aria-label={t(["authenticated", "forms", "remove-field"], {
									values: { field: field.label },
								})}
								onPress={onRemove}
							>
								{t(["authenticated", "controls", "delete"])}
							</FormRecordRemoveButton>
						) : null}
					</FormFieldListItemControls>
				</div>
			</div>
			<FormFieldArrayControls>
				<FormRecordAddButton ref={triggerRef} {...triggerProps} onPress={onOpenDialog}>
					{t(["authenticated", "forms", "add-field"], {
						values: { field: field.label },
					})}
				</FormRecordAddButton>
				{dialog.isOpen ? (
					<ModalDialog
						{...(overlayProps as any)}
						isDismissable
						isOpen={dialog.isOpen}
						onClose={onCloseDialog}
						title={t(["authenticated", "media", "upload-media-dialog-title"])}
					>
						<MediaUploadForm
							fileTypes={["image"]}
							name="upload-media"
							onCancel={onCloseDialog}
							onSubmit={onSubmit}
						/>
					</ModalDialog>
				) : null}
			</FormFieldArrayControls>
		</FormFieldArray>
	);
}
