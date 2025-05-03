import { useTranslations } from "next-intl";
import { useMemo } from "react";

export type ItemFormDateFields = ReturnType<typeof useItemFormDateFields>;

export function useItemFormDateFields(prefix = "") {
	const t = useTranslations();

	const fields = useMemo(() => {
		const fields = {
			dateCreated: {
				name: `${prefix}dateCreated`,
				label: t("authenticated.fields.dateCreated.label"),
				description: t("authenticated.fields.dateCreated.description"),
			},
			dateLastUpdated: {
				name: `${prefix}dateLastUpdated`,
				label: t("authenticated.fields.dateLastUpdated.label"),
				description: t("authenticated.fields.dateLastUpdated.description"),
			},
		};

		return fields;
	}, [prefix, t]);

	return fields;
}
