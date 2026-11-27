import formFieldListCss from "@/components/common/FormFieldList.module.css";
import formFieldListItemCss from "@/components/common/FormFieldListItem.module.css";

import { useTranslations } from "next-intl";
import { Fragment, type ReactNode, useState } from "react";
import { DialogTrigger } from "react-aria-components";
import { useForm } from "react-final-form";

import { FormFieldArray } from "@/components/common/FormFieldArray";
import { FormFieldArrayControls } from "@/components/common/FormFieldArrayControls";
import { FormFieldListItemControls } from "@/components/common/FormFieldListItemControls";
import { FormRecordAddButton } from "@/components/common/FormRecordAddButton";
import { FormRecordRemoveButton } from "@/components/common/FormRecordRemoveButton";
import { MediaUploadForm } from "@/components/item-form/MediaUploadForm";
import { ReviewField } from "@/components/item-form/ReviewField";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import { useSubmitMediaUploadForm } from "@/components/item-form/useSubmitMediaUploadForm";
import type { ItemMediaInput, ItemsDiff } from "@/data/sshoc/api/item";
import { FormThumbnail } from "@/lib/core/form/FormThumbnail";
import { useFieldState } from "@/lib/core/form/useFieldState";
import { ModalDialog } from "@/lib/core/ui/ModalDialog/ModalDialog";
import { Thumbnail } from "@/lib/core/ui/Thumbnail/Thumbnail";

export interface ReviewThumbnailFormFieldProps {
	field: ItemFormFields["fields"]["thumbnail"];
}

export function ReviewThumbnailFormField(props: ReviewThumbnailFormFieldProps): ReactNode {
	const { field } = props;

	const t = useTranslations();
	const form = useForm();
	const [isOpen, setOpen] = useState(false);

	function onCloseDialog() {
		setOpen(false);
	}

	function onAdd(data: ItemMediaInput) {
		form.change(field.name, data);
	}

	const onSubmit = useSubmitMediaUploadForm({
		onClose() {
			setOpen(false);
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
					<ReviewField<ItemsDiff["item"]["thumbnail"]>
						name={field.name}
						// eslint-disable-next-line react/no-unstable-nested-components
						review={({ status, value }) => {
							return (
								<Thumbnail
									color={`review ${status}`}
									// isReadOnly
									value={value}
								/>
							);
						}}
					>
						<Fragment>
							<FormThumbnail {...field} />
							<FormFieldListItemControls>
								{thumbnail != null ? (
									<FormRecordRemoveButton
										aria-label={t("authenticated.forms.remove-field", {
											field: field.label,
										})}
										onPress={onRemove}
									>
										{t("authenticated.controls.delete")}
									</FormRecordRemoveButton>
								) : null}
							</FormFieldListItemControls>
						</Fragment>
					</ReviewField>
				</div>
			</div>
			<FormFieldArrayControls>
				<DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
					<FormRecordAddButton>
						{t("authenticated.forms.add-field", {
							field: field.label,
						})}
					</FormRecordAddButton>
					<ModalDialog
						isDismissable
						onClose={onCloseDialog}
						title={t("authenticated.media.upload-media-dialog-title")}
					>
						<MediaUploadForm
							fileTypes={["image"]}
							name="upload-media"
							onCancel={onCloseDialog}
							onSubmit={onSubmit}
						/>
					</ModalDialog>
				</DialogTrigger>
			</FormFieldArrayControls>
		</FormFieldArray>
	);
}
