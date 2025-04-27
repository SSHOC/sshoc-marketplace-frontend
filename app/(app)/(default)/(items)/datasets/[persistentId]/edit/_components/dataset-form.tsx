"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useActionState } from "react";

import { updateAction } from "@/app/(app)/(default)/(items)/datasets/[persistentId]/edit/_actions/update-action";
import { Form } from "@/components/form";
import { ButtonLink } from "@/components/ui/button";
import { FieldDescription } from "@/components/ui/field-description";
import { FieldError } from "@/components/ui/field-error";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextInput } from "@/components/ui/text-input";
import { TextArea } from "@/components/ui/textarea";
import type { GetDataset } from "@/lib/api/client";
import { createHref } from "@/lib/navigation/create-href";
import { createInitialActionState, getFieldErrors } from "@/lib/server/actions";

interface DatasetFormProps {
	canPublish: boolean;
	item: GetDataset.Response;
}

export function DatasetForm(props: Readonly<DatasetFormProps>): ReactNode {
	const { canPublish, item } = props;

	const t = useTranslations("DatasetForm");

	const [formState, formAction] = useActionState(updateAction, createInitialActionState({}));

	return (
		<Form
			action={formAction}
			className="grid gap-y-8"
			onSubmit={(event) => {
				/**
				 * Avoid form-reset behavior in react 19.
				 *
				 * @see https://github.com/facebook/react/issues/29034
				 */
				event.preventDefault();
				const formElement = event.currentTarget;
				const submitter = (event.nativeEvent as SubmitEvent).submitter;
				const formData = new FormData(formElement, submitter);
				formAction(formData);
			}}
			validationErrors={getFieldErrors(formState)}
		>
			<section>
				<h2>{t("sections.base")}</h2>

				<TextInput defaultValue={item.label} isRequired={true} name="label">
					<Label>{t("fields.label.label")}</Label>
					<Input />
					<FieldDescription>{t("fields.label.description")}</FieldDescription>
					<FieldError />
				</TextInput>

				<TextInput defaultValue={item.description} isRequired={true} name="description">
					<Label>{t("fields.description.label")}</Label>
					<TextArea rows={6} />
					<FieldDescription>{t("fields.description.description")}</FieldDescription>
					<FieldError />
				</TextInput>

				<RichTextEditor />

				<ul role="list">
					{item.accessibleAt.map((url, index) => {
						return (
							<li key={index}>
								<TextInput
									defaultValue={url}
									isRequired={true}
									name={`accessibleAt.${String(index)}`}
								>
									<Label>{t("fields.accessible-at.label")}</Label>
									<Input />
									<FieldDescription>{t("fields.accessible-at.description")}</FieldDescription>
									<FieldError />
								</TextInput>
							</li>
						);
					})}
				</ul>
			</section>

			<section>
				<h2>{t("sections.dates")}</h2>
			</section>

			<section>
				<h2>{t("sections.actors")}</h2>
			</section>

			<section>
				<h2>{t("sections.properties")}</h2>
			</section>

			<section>
				<h2>{t("sections.media")}</h2>
			</section>

			<section>
				<h2>{t("sections.thumbnail")}</h2>
			</section>

			<section>
				<h2>{t("sections.relations")}</h2>
			</section>

			<FormError state={formState} />
			<FormSuccess state={formState} />

			<footer>
				<ButtonLink
					href={createHref({
						pathname: ``,
					})}
					kind="text"
				>
					{t("controls.cancel")}
				</ButtonLink>

				<SubmitButton kind="text" name="_action" value="draft">
					{t("controls.save-draft")}
				</SubmitButton>

				{canPublish ? (
					<SubmitButton name="_action" value="publish">
						{t("controls.publish")}
					</SubmitButton>
				) : (
					<SubmitButton name="_action" value="suggest">
						{t("controls.suggest")}
					</SubmitButton>
				)}
			</footer>
		</Form>
	);
}
