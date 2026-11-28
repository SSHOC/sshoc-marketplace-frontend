import { useTranslations } from "next-intl";
import { Fragment, type ReactNode, useState } from "react";
import { DialogTrigger } from "react-aria-components";
import { useFieldArray } from "react-final-form-arrays";

import { FormFieldArray } from "@/components/common/FormFieldArray";
import { FormFieldArrayControls } from "@/components/common/FormFieldArrayControls";
import { FormFieldList } from "@/components/common/FormFieldList";
import { FormFieldListItem } from "@/components/common/FormFieldListItem";
import { FormFieldListItemControls } from "@/components/common/FormFieldListItemControls";
import { FormRecordAddButton } from "@/components/common/FormRecordAddButton";
import { FormRecordRemoveButton } from "@/components/common/FormRecordRemoveButton";
import { MediaUploadForm } from "@/components/item-form/MediaUploadForm";
import { ReviewFieldListItem } from "@/components/item-form/ReviewFieldListItem";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import { useSubmitMediaUploadForm } from "@/components/item-form/useSubmitMediaUploadForm";
import type { ItemMediaInput, ItemsDiff } from "@/data/sshoc/api/item";
import { FormThumbnail } from "@/lib/core/form/FormThumbnail";
import { ModalDialog } from "@/lib/core/ui/ModalDialog/ModalDialog";
import { Thumbnail } from "@/lib/core/ui/Thumbnail/Thumbnail";

export interface ReviewMediaFormFieldArrayProps {
	field: ItemFormFields["fields"]["media"];
}

export function ReviewMediaFormFieldArray(props: ReviewMediaFormFieldArrayProps): ReactNode {
	const { field } = props;

	const t = useTranslations();
	const fieldArray = useFieldArray<ItemMediaInput | UndefinedLeaves<ItemMediaInput>>(field.name, {
		subscription: {},
	});
	const [isOpen, setOpen] = useState(false);

	function onCloseDialog() {
		setOpen(false);
	}

	function onAdd(data: ItemMediaInput) {
		fieldArray.fields.push(data);
	}

	const onSubmit = useSubmitMediaUploadForm({
		onClose() {
			setOpen(false);
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

					// const fieldGroup = {
					//   info: {
					//     ...field.fields.info,
					//     name: [name, field.fields.info.name].join('.'),
					//     _root: [name, field.fields.info._root].join('.'),
					//   },
					//   caption: {
					//     ...field.fields.caption,
					//     name: [name, field.fields.caption.name].join('.'),
					//   },
					//   licence: {
					//     ...field.fields.licence,
					//     name: [name, field.fields.licence.name].join('.'),
					//     _root: [name, field.fields.licence._root].join('.'),
					//   },
					// }

					return (
						<FormFieldListItem key={name}>
							<ReviewFieldListItem<ItemsDiff["item"]["media"][number]>
								name={name}
								fields={fieldArray.fields}
								index={index}
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
									<FormThumbnail {...field} name={name} />
									<FormFieldListItemControls>
										<FormRecordRemoveButton
											aria-label={t("authenticated.forms.remove-field", {
												field: field.itemLabel,
											})}
											onPress={onRemove}
										>
											{t("authenticated.controls.delete")}
										</FormRecordRemoveButton>
									</FormFieldListItemControls>
								</Fragment>
							</ReviewFieldListItem>
						</FormFieldListItem>
					);
				})}
			</FormFieldList>
			<FormFieldArrayControls>
				<DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
					<FormRecordAddButton>
						{t("authenticated.forms.add-field", {
							field: field.itemLabel,
						})}
					</FormRecordAddButton>
					<ModalDialog
						isDismissable
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
				</DialogTrigger>
			</FormFieldArrayControls>
		</FormFieldArray>
	);
}
