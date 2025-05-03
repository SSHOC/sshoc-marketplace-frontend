import { useTranslations } from "next-intl";
import { useMemo } from "react";

export type SourceFormFields = ReturnType<typeof useSourceFormFields>;

export function useSourceFormFields(prefix = "") {
	const t = useTranslations();

	const fields = useMemo(() => {
		const fields = {
			label: {
				name: `${prefix}label`,
				label: t("authenticated.sources.label.label"),
				description: t("authenticated.sources.label.description"),
				isRequired: true,
			},
			url: {
				name: `${prefix}url`,
				label: t("authenticated.sources.url.label"),
				description: t("authenticated.sources.url.description"),
				isRequired: true,
			},
			urlTemplate: {
				name: `${prefix}urlTemplate`,
				label: t("authenticated.sources.urlTemplate.label"),
				description: t("authenticated.sources.urlTemplate.description"),
				isRequired: true,
			},
		};

		return fields;
	}, [prefix, t]);

	return fields;
}
