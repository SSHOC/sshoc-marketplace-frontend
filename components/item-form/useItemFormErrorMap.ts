import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { z } from "zod";

export function useItemFormErrorMap(): z.ZodErrorMap {
	const t = useTranslations();

	const errorMap = useMemo(() => {
		const errorMap: z.ZodErrorMap = function errorMap(issue) {
			/**
			 * @see https://github.com/colinhacks/zod/blob/master/ERROR_HANDLING.md#zodissuecode
			 */
			switch (issue.code) {
				case z.ZodIssueCode.invalid_type: {
					if (issue.input === undefined) {
						return { message: t("authenticated.validation.empty-field") };
					}
					break;
				}

				case z.ZodIssueCode.invalid_format: {
					switch (issue.format) {
						case "email":
							return { message: t("authenticated.validation.invalid-email") };
						case "url":
							return { message: t("authenticated.validation.invalid-url") };
						default:
							break;
					}
					break;
				}

				case z.ZodIssueCode.invalid_value: {
					break;
				}

				case z.ZodIssueCode.invalid_union: {
					break;
				}

				case z.ZodIssueCode.custom: {
					if (issue.params?.["invalidValue"] === true) {
						return {
							message: t("authenticated.validation.invalid-value-type", {
								// @ts-expect-error Should be fine.
								type: t(`authenticated.validation.data-types.${issue.params["type"]}`),
							}),
						};
					}
					break;
				}

				default:
					break;
			}

			return undefined;
		};

		return errorMap;
	}, [t]);

	return errorMap;
}
