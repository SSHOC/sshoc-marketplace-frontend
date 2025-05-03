import { useTranslations } from "next-intl";
import { useMemo } from "react";

export type ConceptFormFields = ReturnType<typeof useConceptFormFields>;

export function useConceptFormFields(prefix = "") {
	const t = useTranslations();

	const fields = useMemo(() => {
		const fields = {
			vocabulary: {
				name: `${prefix}vocabulary.code`,
				_root: `${prefix}vocabulary`,
				label: t("authenticated.concepts.vocabulary.label"),
				description: t("authenticated.concepts.vocabulary.description"),
				isRequired: true,
			},
			label: {
				name: `${prefix}label`,
				label: t("authenticated.concepts.label.label"),
				description: t("authenticated.concepts.label.description"),
				isRequired: true,
			},
			notation: {
				name: `${prefix}notation`,
				label: t("authenticated.concepts.notation.label"),
				description: t("authenticated.concepts.notation.description"),
			},
			definition: {
				name: `${prefix}definition`,
				label: t("authenticated.concepts.definition.label"),
				description: t("authenticated.concepts.definition.description"),
			},
		};

		return fields;
	}, [prefix, t]);

	return fields;
}
