import type { ReactNode } from "react";
import { useFormState } from "react-final-form";

import css from "@/components/item-form/FormSubmitErrorMessage.module.css";
import { useI18n } from "@/lib/core/i18n/useI18n";

export function FormSubmitErrorMessage(): ReactNode {
	const { t } = useI18n<"authenticated">();
	const form = useFormState({ subscription: { hasSubmitErrors: true, submitError: true } });

	if (!form.hasSubmitErrors) {
		return null;
	}

	return (
		<p className={css["message"]}>
			{t(["authenticated", "validation", "last-submission-failed"])}: {form.submitError}
		</p>
	);
}
