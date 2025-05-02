import type { FormApi } from "final-form";
import type { ReactNode } from "react";

import { FormSections } from "@/components/common/FormSections";
import { ActorReviewFormSection } from "@/components/item-form/ActorReviewFormSection";
import { DateReviewFormSection } from "@/components/item-form/DateReviewFormSection";
import { ItemReviewFormControls } from "@/components/item-form/ItemReviewFormControls";
import { MainReviewFormSection } from "@/components/item-form/MainReviewFormSection";
import { MediaReviewFormSection } from "@/components/item-form/MediaReviewFormSection";
import { OtherSuggestedItemVersionsFormSection } from "@/components/item-form/OtherSuggestedItemVersionsFormSection";
import { PropertyReviewFormSection } from "@/components/item-form/PropertyReviewFormSection";
import { RelatedReviewItemFormSection } from "@/components/item-form/RelatedReviewItemFormSection";
import { ReviewFormMetadata } from "@/components/item-form/ReviewFormMetadata";
import { ThumbnailReviewFormSection } from "@/components/item-form/ThumbnailReviewFormSection";
import { useItemDiffFormInitialValues } from "@/components/item-form/useItemDiffFormInitialValues";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import type { Item, ItemInput, ItemsDiff } from "@/data/sshoc/api/item";
import type { FormProps } from "@/lib/core/form/Form";
import { Form } from "@/lib/core/form/Form";

export type ItemReviewFormValues<T extends ItemInput> = T & {
	persistentId?: Item["persistentId"];
	status?: Item["status"];
	__submitting__?: boolean;
};

export interface ItemReviewFormProps<T extends ItemInput> extends FormProps<T> {
	diff: ItemsDiff | undefined;
	name?: string;
	onCancel: () => void;
	onReject: () => void;
	formFields: ItemFormFields;
}

export function ItemReviewForm<T extends ItemReviewFormValues<ItemInput>>(
	props: ItemReviewFormProps<T>,
): ReactNode {
	const { diff, formFields, initialValues, name, onCancel, onReject, onSubmit, validate } = props;

	// FIXME: Make ItemsDiff generic, fix initialValues type
	const initialValuesWithDeletedFields = useItemDiffFormInitialValues({
		diff,
		item: initialValues,
	});

	function onBeforeSubmit(form: FormApi<T>) {
		form.change("__submitting__", true);
	}

	return (
		<Form
			initialValues={initialValuesWithDeletedFields}
			name={name}
			onSubmit={onSubmit}
			validate={validate}
		>
			<ReviewFormMetadata diff={diff}>
				<FormSections>
					<MainReviewFormSection formFields={formFields} />
					<DateReviewFormSection formFields={formFields} />
					<ActorReviewFormSection formFields={formFields} />
					<PropertyReviewFormSection formFields={formFields} />
					<MediaReviewFormSection formFields={formFields} />
					<ThumbnailReviewFormSection formFields={formFields} />
					<RelatedReviewItemFormSection formFields={formFields} />

					<OtherSuggestedItemVersionsFormSection />

					<ItemReviewFormControls<T>
						onReject={onReject}
						onCancel={onCancel}
						onBeforeSubmit={onBeforeSubmit}
					/>
				</FormSections>
			</ReviewFormMetadata>
		</Form>
	);
}

// @refresh reset
