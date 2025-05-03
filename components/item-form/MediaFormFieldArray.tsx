import { useTranslations } from "next-intl";
import { Fragment, type ReactNode, useMemo, useRef } from "react";
import { useField } from "react-final-form";
import { useFieldArray } from "react-final-form-arrays";

import { FormFieldArray } from "@/components/common/FormFieldArray";
import { FormFieldArrayControls } from "@/components/common/FormFieldArrayControls";
import { FormFieldList } from "@/components/common/FormFieldList";
import { FormFieldListItem } from "@/components/common/FormFieldListItem";
import { FormFieldListItemControls } from "@/components/common/FormFieldListItemControls";
import { FormRecordAddButton } from "@/components/common/FormRecordAddButton";
import { FormRecordEditButton } from "@/components/common/FormRecordEditButton";
import { FormRecordRemoveButton } from "@/components/common/FormRecordRemoveButton";
import type { MediaUploadFormValues } from "@/components/item-form/MediaUploadForm";
import { MediaUploadForm } from "@/components/item-form/MediaUploadForm";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import { useSubmitMediaUploadForm } from "@/components/item-form/useSubmitMediaUploadForm";
import type { ItemMedia, ItemMediaInput } from "@/data/sshoc/api/item";
import { FormThumbnail } from "@/lib/core/form/FormThumbnail";
import { ModalDialog } from "@/lib/core/ui/ModalDialog/ModalDialog";
import { useModalDialogTriggerState } from "@/lib/core/ui/ModalDialog/useModalDialogState";
import { useModalDialogTrigger } from "@/lib/core/ui/ModalDialog/useModalDialogTrigger";

export interface MediaFormFieldArrayProps {
	field: ItemFormFields["fields"]["media"];
}

export function MediaFormFieldArray(props: MediaFormFieldArrayProps): ReactNode {
	const { field } = props;

	const t = useTranslations();
	const fieldArray = useFieldArray<ItemMediaInput | UndefinedLeaves<ItemMediaInput>>(field.name, {
		subscription: {},
	});
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
		fieldArray.fields.push(data);
	}

	const onSubmit = useSubmitMediaUploadForm({
		onClose() {
			dialog.close();
		},
		onSuccess(data: ItemMediaInput) {
			onAdd(data);
		},
	});

	return (
		<FormFieldArray>
			<FormFieldList variant="thumbnails" key={fieldArray.fields.length}>
				{fieldArray.fields.map((name, index) => {
					function onRemove() {
						fieldArray.fields.remove(index);
					}

					function onEdit(data: ItemMediaInput) {
						fieldArray.fields.update(index, data);
					}

					const _fieldGroup = {
						info: {
							...field.fields.info,
							name: [name, field.fields.info.name].join("."),
							_root: [name, field.fields.info._root].join("."),
						},
						caption: {
							...field.fields.caption,
							name: [name, field.fields.caption.name].join("."),
						},
						licence: {
							...field.fields.licence,
							name: [name, field.fields.licence.name].join("."),
							_root: [name, field.fields.licence._root].join("."),
						},
					};

					return (
						<FormFieldListItem key={name}>
							<FormThumbnail {...field} name={name} />
							<FormFieldListItemControls>
								<MediaEditButton name={name} field={field} onEdit={onEdit} />
								<FormRecordRemoveButton
									aria-label={t("authenticated.forms.remove-field", {
										field: field.itemLabel,
									})}
									onPress={onRemove}
								>
									{t("authenticated.controls.delete")}
								</FormRecordRemoveButton>
							</FormFieldListItemControls>
						</FormFieldListItem>
					);
				})}
			</FormFieldList>
			<FormFieldArrayControls>
				<FormRecordAddButton ref={triggerRef} {...triggerProps} onPress={onOpenDialog}>
					{t("authenticated.forms.add-field", {
						field: field.itemLabel,
					})}
				</FormRecordAddButton>
				{dialog.isOpen ? (
					<ModalDialog
						{...(overlayProps as any)}
						isDismissable
						isOpen={dialog.isOpen}
						onClose={onCloseDialog}
						title={t("authenticated.media.upload-media-dialog-title")}
					>
						<MediaUploadForm
							fileTypes={["image", "video"]}
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

interface MediaEditButtonProps {
	name: string;
	field: ItemFormFields["fields"]["media"];
	onEdit: (data: ItemMediaInput) => void;
}

function MediaEditButton(props: MediaEditButtonProps): ReactNode {
	const { field, onEdit, name } = props;

	const t = useTranslations();

	const values = useField(name).input.value as ItemMedia | undefined;

	const initialValues = useMemo<Partial<MediaUploadFormValues> | undefined>(() => {
		if (values == null) {
			return undefined;
		}

		if ("location" in values.info) {
			return {
				sourceUrl: values.info.location.sourceUrl,
				caption: values.caption,
				concept: values.concept,
			};
		}

		return {
			file: undefined,
			caption: values.caption,
			concept: values.concept,
		};
	}, [values]);

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

	const onSubmit = useSubmitMediaUploadForm({
		onClose() {
			dialog.close();
		},
		onSuccess(data: ItemMediaInput) {
			onEdit(data);
		},
	});

	return (
		<Fragment>
			<FormRecordEditButton
				ref={triggerRef}
				{...triggerProps}
				aria-label={t("authenticated.forms.edit-field", {
					field: field.itemLabel,
				})}
				onPress={onOpenDialog}
			>
				{t("authenticated.controls.edit")}
			</FormRecordEditButton>
			{dialog.isOpen ? (
				<ModalDialog
					{...(overlayProps as any)}
					isDismissable
					isOpen={dialog.isOpen}
					onClose={onCloseDialog}
					title={t("authenticated.media.upload-media-dialog-title")}
				>
					<MediaUploadForm
						initialValues={initialValues}
						fileTypes={["image", "video"]}
						name="upload-media"
						onCancel={onCloseDialog}
						onSubmit={onSubmit}
					/>
				</ModalDialog>
			) : null}
		</Fragment>
	);
}
