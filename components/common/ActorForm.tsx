import { Fragment, type ReactNode } from "react";
import { useFieldArray } from "react-final-form-arrays";

import { ActorComboBox } from "@/components/common/ActorComboBox";
import { ActorFormControls } from "@/components/common/ActorFormControls";
import { FormRecordAddButton } from "@/components/common/FormRecordAddButton";
import { FormRecordRemoveButton } from "@/components/common/FormRecordRemoveButton";
import { FormSection } from "@/components/common/FormSection";
import type { ActorFormFields } from "@/components/common/useActorFormFields";
import { useActorFormFields } from "@/components/common/useActorFormFields";
import type { ActorExternalIdInput, ActorInput } from "@/data/sshoc/api/actor";
import { useActorSources } from "@/data/sshoc/hooks/actor";
import { actorInputSchema } from "@/data/sshoc/validation-schemas/actor";
import { Form } from "@/lib/core/form/Form";
import { FormSelect } from "@/lib/core/form/FormSelect";
import { FormTextField } from "@/lib/core/form/FormTextField";
import { useFieldState } from "@/lib/core/form/useFieldState";
import { validateSchema } from "@/lib/core/form/validateSchema";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { Item } from "@/lib/core/ui/Collection/Item";

export type ActorFormValues = ActorInput;

export interface ActorFormProps {
	initialValues?: Partial<ActorFormValues>;
	name?: string;
	onCancel: () => void;
	onSubmit: (actor: ActorFormValues) => void;
}

export function ActorForm(props: ActorFormProps): ReactNode {
	const { initialValues, name, onCancel, onSubmit } = props;

	const fields = useActorFormFields();

	return (
		<Form
			initialValues={initialValues}
			name={name}
			onSubmit={onSubmit}
			validate={validateSchema(actorInputSchema)}
		>
			<FormSection>
				<FormTextField {...fields.name} />
				<ActorExternalIdsFieldArray field={fields.externalIds} />
				<FormTextField {...fields.email} />
				<FormTextField {...fields.website} />
				<ActorAffiliationsFieldArray field={fields.affiliations} />

				<ActorFormControls onCancel={onCancel} />
			</FormSection>
		</Form>
	);
}

export interface ActorExternalIdsFieldArrayProps {
	field: ActorFormFields["externalIds"];
}

export function ActorExternalIdsFieldArray(props: ActorExternalIdsFieldArrayProps): ReactNode {
	const { field } = props;

	const { t } = useI18n<"authenticated" | "common">();
	const fieldArray = useFieldArray<ActorExternalIdInput | UndefinedLeaves<ActorExternalIdInput>>(
		field.name,
		{ subscription: {} },
	);

	function onAdd() {
		fieldArray.fields.push({ identifier: undefined, identifierService: { code: undefined } });
	}

	return (
		<div>
			<div>
				{fieldArray.fields.map((name, index) => {
					function onRemove() {
						fieldArray.fields.remove(index);
					}

					const fieldGroup = {
						identifier: {
							...field.fields.identifier,
							name: [name, field.fields.identifier.name].join("."),
						},
						identifierService: {
							...field.fields.identifierService,
							name: [name, field.fields.identifierService.name].join("."),
							_root: [name, field.fields.identifierService._root].join("."),
						},
					};

					return (
						<div key={name}>
							<div role="group">
								<ActorIdentifierServiceSelect field={fieldGroup.identifierService} />
								<ActorIdentifierField
									field={fieldGroup.identifier}
									identifierServiceFieldName={fieldGroup.identifierService.name}
								/>
							</div>
							<div>
								<FormRecordRemoveButton
									aria-label={t(["authenticated", "forms", "remove-field"], {
										values: { field: field.label },
									})}
									onPress={onRemove}
								>
									{t(["authenticated", "controls", "delete"])}
								</FormRecordRemoveButton>
							</div>
						</div>
					);
				})}
			</div>
			<div>
				<FormRecordAddButton onPress={onAdd}>
					{t(["authenticated", "forms", "add-field"], {
						values: { field: field.label },
					})}
				</FormRecordAddButton>
			</div>
		</div>
	);
}

export interface ActorIdentifierServiceSelectProps {
	field: ActorFormFields["externalIds"]["fields"]["identifierService"];
}

export function ActorIdentifierServiceSelect(props: ActorIdentifierServiceSelectProps): ReactNode {
	const { field } = props;

	const actorSources = useActorSources();
	const items = actorSources.data ?? [];

	return (
		<FormSelect {...field} isLoading={actorSources.isLoading} items={items}>
			{(item) => {
				return <Item key={item.code}>{item.label}</Item>;
			}}
		</FormSelect>
	);
}

export interface ActorAffiliationsFieldArrayProps {
	field: ActorFormFields["affiliations"];
}

export function ActorAffiliationsFieldArray(props: ActorAffiliationsFieldArrayProps): ReactNode {
	const { field } = props;

	const { t } = useI18n<"authenticated" | "common">();
	const fieldArray = useFieldArray<string | undefined>(field.name);

	function onAdd() {
		fieldArray.fields.push(undefined);
	}

	return (
		<div>
			<div>
				{fieldArray.fields.map((name, index) => {
					function onRemove() {
						fieldArray.fields.remove(index);
					}

					const fieldGroup = {
						actor: {
							...field.fields.actor,
							name: [name, field.fields.actor.name].join("."),
							_root: name,
						},
					};

					return (
						<div key={name}>
							<ActorComboBox field={fieldGroup.actor} />
							<div>
								<FormRecordRemoveButton
									aria-label={t(["authenticated", "forms", "remove-field"], {
										values: { field: field.label },
									})}
									onPress={onRemove}
								>
									{t(["authenticated", "controls", "delete"])}
								</FormRecordRemoveButton>
							</div>
						</div>
					);
				})}
			</div>
			<div>
				<FormRecordAddButton onPress={onAdd}>
					{t(["authenticated", "forms", "add-field"], {
						values: { field: field.label },
					})}
				</FormRecordAddButton>
			</div>
		</div>
	);
}

export interface ActorIdentifierFieldProps {
	field: ActorFormFields["externalIds"]["fields"]["identifier"];
	identifierServiceFieldName: string;
}

export function ActorIdentifierField(props: ActorIdentifierFieldProps): ReactNode {
	const { field, identifierServiceFieldName } = props;

	const { t } = useI18n<"authenticated" | "common">();
	const service = useFieldState<string | null>(identifierServiceFieldName).input.value;
	const value = useFieldState<string | null>(field.name).input.value;
	const actorSources = useActorSources(undefined, {
		enabled: service != null && service.length > 0,
	});
	const sources = actorSources.data ?? [];
	const source = sources.find((source) => {
		return source.code === service;
	});
	const template = source?.urlTemplate?.replace(/\{source-actor-id\}/, value ?? "");

	const description = (
		<Fragment>
			<span>{field.description}</span>
			{template != null ? (
				<span>
					{" "}
					{t(["authenticated", "actorExternalId", "description"], { values: { template } })}
				</span>
			) : null}
		</Fragment>
	);

	return <FormTextField {...field} description={description} />;
}
