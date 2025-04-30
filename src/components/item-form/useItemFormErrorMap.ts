import { useMemo } from "react";
import { z } from "zod";

import { useI18n } from "@/lib/core/i18n/useI18n";

export function useItemFormErrorMap(): z.ZodErrorMap {
	const { t } = useI18n<"authenticated" | "common">();

	const errorMap = useMemo(() => {
		const errorMap: z.ZodErrorMap = function errorMap(issue, context) {
			/**
			 * @see https://github.com/colinhacks/zod/blob/master/ERROR_HANDLING.md#zodissuecode
			 */
			switch (issue.code) {
				case z.ZodIssueCode.invalid_type: {
					if (issue.received === "undefined") {
						return { message: t(["authenticated", "validation", "empty-field"]) };
					}
					break;
				}

				case z.ZodIssueCode.invalid_string: {
					switch (issue.validation) {
						case "email":
							return { message: t(["authenticated", "validation", "invalid-email"]) };
						case "url":
							return { message: t(["authenticated", "validation", "invalid-url"]) };
						default:
							break;
					}
					break;
				}

				case z.ZodIssueCode.invalid_date: {
					break;
				}

				case z.ZodIssueCode.invalid_enum_value: {
					break;
				}

				case z.ZodIssueCode.invalid_union: {
					break;
				}

				case z.ZodIssueCode.custom: {
					if (issue.params?.["invalidValue"] === true) {
						return {
							message: t(["authenticated", "validation", "invalid-value-type"], {
								values: {
									type: t(["authenticated", "validation", "data-types", issue.params["type"]]),
								},
							}),
						};
					}
					break;
				}

				default:
					break;
			}

			return { message: context.defaultError };
		};

		return errorMap;
	}, [t]);

	return errorMap;
}
