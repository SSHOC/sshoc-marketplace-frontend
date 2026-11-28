import { camelCase } from "change-case";
import { useTranslations } from "next-intl";
import { Fragment, type ReactNode, useState } from "react";
import { DialogTrigger } from "react-aria-components";

import type { ConceptFormValues } from "@/components/common/ConceptForm";
import { ConceptForm } from "@/components/common/ConceptForm";
import type { PropertyType } from "@/data/sshoc/api/property";
import { useCreateConcept } from "@/data/sshoc/hooks/vocabulary";
import { PASSED_IN_VIA_MUTATION_FUNCTION } from "@/data/sshoc/lib/const";
import type { MutationMetadata } from "@/lib/core/query/types";
import { Button } from "@/lib/core/ui/Button/Button";
import { ButtonLink } from "@/lib/core/ui/Button/ButtonLink";
import { ModalDialog } from "@/lib/core/ui/ModalDialog/ModalDialog";

export interface SuggestConceptButtonProps {
	propertyType: PropertyType;
	/** @default 'button' */
	variant?: "button-link" | "button";
}

export function SuggestConceptButton(props: SuggestConceptButtonProps): ReactNode {
	const { propertyType, variant = "button" } = props;

	const [isOpen, setOpen] = useState(false);
	const t = useTranslations();
	const meta: MutationMetadata = {
		messages: {
			mutate() {
				return t("authenticated.concepts.suggest-concept-pending");
			},
			success() {
				return t("authenticated.concepts.suggest-concept-success");
			},
			error() {
				return t("authenticated.concepts.suggest-concept-error");
			},
		},
	};
	const createConcept = useCreateConcept(
		{ vocabularyCode: PASSED_IN_VIA_MUTATION_FUNCTION, candidate: true },
		undefined,
		{ meta },
	);

	function onCreateConcept(values: ConceptFormValues) {
		const { vocabulary, ...concept } = values;
		/** Identifier must be provided by the client. */
		const data = { ...concept, code: camelCase(concept.label) };
		setOpen(false);
		createConcept.mutate({ vocabularyCode: vocabulary.code, data });
	}

	function onCloseDialog() {
		setOpen(false);
	}

	return (
		<Fragment>
			<DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
				{variant === "button-link" ? (
					<ButtonLink>{t("authenticated.concepts.suggest-concept")}</ButtonLink>
				) : (
					<Button color="gradient">{t("authenticated.concepts.suggest-concept")}</Button>
				)}
				<ModalDialog
					isDismissable
					onClose={onCloseDialog}
					title={t("authenticated.concepts.suggest-concept")}
				>
					<ConceptForm
						name="create-concept"
						onCancel={onCloseDialog}
						onSubmit={onCreateConcept}
						propertyType={propertyType}
					/>
				</ModalDialog>
			</DialogTrigger>
		</Fragment>
	);
}
