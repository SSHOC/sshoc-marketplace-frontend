import { useTranslations } from "next-intl";

import { SeeVocabularyLink } from "@/components/item-form/SeeVocabularyLink";

export function useItemFormFieldProperties(prefix = "") {
	const t = useTranslations();

	const properties = {
		"access-policy-url": {
			name: `${prefix}access-policy-url`,
			description: t("authenticated.properties.access-policy-url.description"),
		},
		activity: {
			name: `${prefix}activity`,
			description: t.rich("authenticated.properties.activity.description", {
				Link() {
					return <SeeVocabularyLink type="activity" />;
				},
			}),
		},
		authentication: {
			name: `${prefix}authentication`,
			description: t("authenticated.properties.authentication.description"),
		},
		conference: {
			name: `${prefix}conference`,
			description: t("authenticated.properties.conference.description"),
		},
		discipline: {
			name: `${prefix}discipline`,
			description: t.rich("authenticated.properties.discipline.description", {
				Link() {
					return <SeeVocabularyLink type="discipline" />;
				},
			}),
		},
		"geographical-availability": {
			name: `${prefix}geographical-availability`,
			description: t.rich("authenticated.properties.geographical-availability.description", {
				Link() {
					return <SeeVocabularyLink type="geographical-availability" />;
				},
			}),
		},
		"helpdesk-url": {
			name: `${prefix}helpdesk-url`,
			description: t("authenticated.properties.helpdesk-url.description"),
		},
		issue: {
			name: `${prefix}issue`,
			description: t("authenticated.properties.issue.description"),
		},
		inputformat: {
			name: `${prefix}inputformat`,
			description: t("authenticated.properties.inputformat.description"),
		},
		journal: {
			name: `${prefix}journal`,
			description: t("authenticated.properties.journal.description"),
		},
		keyword: {
			name: `${prefix}keyword`,
			description: t.rich("authenticated.properties.keyword.description", {
				Link() {
					return <SeeVocabularyLink type="keyword" />;
				},
			}),
		},
		language: {
			name: `${prefix}language`,
			description: t.rich("authenticated.properties.language.description", {
				Link() {
					return <SeeVocabularyLink type="language" />;
				},
			}),
		},
		license: {
			name: `${prefix}license`,
			description: t.rich("authenticated.properties.license.description", {
				Link() {
					return <SeeVocabularyLink type="license" />;
				},
			}),
		},
		"life-cycle-status": {
			name: `${prefix}life-cycle-status`,
			description: t.rich("authenticated.properties.life-cycle-status.description", {
				Link() {
					return <SeeVocabularyLink type="life-cycle-status" />;
				},
			}),
		},
		"mode-of-use": {
			name: `${prefix}mode-of-use`,
			description: t.rich("authenticated.properties.mode-of-use.description", {
				Link() {
					return <SeeVocabularyLink type="mode-of-use" />;
				},
			}),
		},
		// 'model-version': {
		//   name: `${prefix}model-version`,
		//   description: t(['authenticated', 'properties', 'model-version', 'description']),
		// },
		"object-format": {
			name: `${prefix}object-format`,
			description: t.rich("authenticated.properties.object-format.description", {
				Link() {
					return <SeeVocabularyLink type="object-format" />;
				},
			}),
		},
		outputformat: {
			name: `${prefix}outputformat`,
			description: t("authenticated.properties.outputformat.description"),
		},
		pages: {
			name: `${prefix}pages`,
			description: t("authenticated.properties.pages.description"),
		},
		"privacy-policy-url": {
			name: `${prefix}privacy-policy-url`,
			description: t("authenticated.properties.privacy-policy-url.description"),
		},
		"publication-type": {
			name: `${prefix}publication-type`,
			description: t.rich("authenticated.properties.publication-type.description", {
				Link() {
					return <SeeVocabularyLink type="publication-type" />;
				},
			}),
		},
		"publication-place": {
			name: `${prefix}publication-place`,
			description: t("authenticated.properties.publication-place.description"),
		},
		publisher: {
			name: `${prefix}publisher`,
			description: t("authenticated.properties.publisher.description"),
		},
		"see-also": {
			name: `${prefix}see-also`,
			description: t("authenticated.properties.see-also.description"),
		},
		"service-level-url": {
			name: `${prefix}service-level-url`,
			description: t("authenticated.properties.service-level-url.description"),
		},
		// 'service-type': {
		//   name: `${prefix}service-type`,
		//   description: t(['authenticated', 'properties', 'service-type', 'description']),
		// },
		"technology-readiness-level": {
			name: `${prefix}technology-readiness-level`,
			description: t.rich("authenticated.properties.technology-readiness-level.description", {
				Link() {
					return <SeeVocabularyLink type="technology-readiness-level" />;
				},
			}),
		},
		"terms-of-use": {
			name: `${prefix}terms-of-use`,
			description: t("authenticated.properties.terms-of-use.description"),
		},
		"terms-of-use-url": {
			name: `${prefix}terms-of-use-url`,
			description: t("authenticated.properties.terms-of-use-url.description"),
		},
		"tool-family": {
			name: `${prefix}tool-family`,
			description: t("authenticated.properties.tool-family.description"),
		},
		"user-manual-url": {
			name: `${prefix}user-manual-url`,
			description: t("authenticated.properties.user-manual-url.description"),
		},
		version: {
			name: `${prefix}version`,
			description: t("authenticated.properties.version.description"),
		},
		volume: {
			name: `${prefix}volume`,
			description: t("authenticated.properties.volume.description"),
		},
		year: {
			name: `${prefix}year`,
			description: t("authenticated.properties.year.description"),
		},
	};

	return properties;
}
