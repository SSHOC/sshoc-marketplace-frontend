import type { ReactNode } from "react";
import { z } from "zod";

import { FormSection } from "@/components/common/FormSection";
import { MediaUploadFormControls } from "@/components/item-form/MediaUploadFormControls";
import type { MediaUploadFormFields } from "@/components/item-form/useMediaUploadFormFields";
import { useMediaUploadFormFields } from "@/components/item-form/useMediaUploadFormFields";
import type { ItemMediaInput } from "@/data/sshoc/api/item";
import { useConceptSearchInfinite } from "@/data/sshoc/hooks/vocabulary";
import { mediaUploadSchema } from "@/data/sshoc/validation-schemas/media";
import { Form } from "@/lib/core/form/Form";
import { FormComboBox } from "@/lib/core/form/FormComboBox";
import type { FormFileInputProps } from "@/lib/core/form/FormFileInput";
import { FormFileInput } from "@/lib/core/form/FormFileInput";
import { FormTextField } from "@/lib/core/form/FormTextField";
import { validateSchema } from "@/lib/core/form/validateSchema";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { Item } from "@/lib/core/ui/Collection/Item";

export type MediaUploadFormValues = Pick<ItemMediaInput, "caption" | "concept"> & {
	file?: FileList | null;
	sourceUrl?: string;
};

export interface MediaUploadFormProps extends Pick<FormFileInputProps, "fileTypes" | "multiple"> {
	initialValues?: Partial<MediaUploadFormValues>;
	name?: string;
	onCancel: () => void;
	onSubmit: (media: MediaUploadFormValues) => void;
}

export function MediaUploadForm(props: MediaUploadFormProps): ReactNode {
	const { fileTypes, initialValues, multiple, name, onCancel, onSubmit } = props;

	const { t } = useI18n<"authenticated" | "common">();
	const fields = useMediaUploadFormFields();

	const errorMap: z.ZodErrorMap = function errorMap(issue, context) {
		switch (issue.code) {
			case z.ZodIssueCode.custom: {
				const mediaInput = issue.params?.["mediaInput"];
				if (Array.isArray(mediaInput)) {
					if (mediaInput.length === 0) {
						return {
							message: t(["authenticated", "media", "validation", "empty-file-and-url"]),
						};
					} else if (mediaInput.length === 2) {
						return { message: t(["authenticated", "media", "validation", "file-or-url"]) };
					}
				}
				break;
			}

			default:
				break;
		}

		return { message: context.defaultError };
	};

	return (
		<Form
			initialValues={initialValues}
			name={name}
			onSubmit={onSubmit}
			validate={validateSchema(mediaUploadSchema, errorMap)}
		>
			<FormSection>
				<FormFileInput {...fields.file} fileTypes={fileTypes} multiple={multiple} />
				<FormTextField {...fields.sourceUrl} />
				<FormTextField {...fields.caption} />
				<LicenceComboBox field={fields.licence} />

				<MediaUploadFormControls onCancel={onCancel} />
			</FormSection>
		</Form>
	);
}

interface LicenceComboBoxProps {
	field: MediaUploadFormFields["licence"];
}

function LicenceComboBox(props: LicenceComboBoxProps): ReactNode {
	const { field } = props;

	const licences = useConceptSearchInfinite({ types: ["license"] });

	const items =
		licences.data?.pages.flatMap((page) => {
			return page.concepts;
		}) ?? [];

	const loadingState = licences.isLoading
		? "loading"
		: licences.isFetchingNextPage
			? "loadingMore"
			: "idle";

	return (
		<FormComboBox
			{...field}
			items={items}
			loadingState={loadingState}
			onLoadMore={
				licences.hasNextPage === true && licences.isSuccess ? licences.fetchNextPage : undefined
			}
		>
			{(item) => {
				return <Item key={item.uri}>{item.label}</Item>;
			}}
		</FormComboBox>
	);
}
