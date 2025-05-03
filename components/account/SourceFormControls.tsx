import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { FormControls } from "@/components/common/FormControls";
import { FormButton } from "@/lib/core/form/FormButton";
import { FormButtonLink } from "@/lib/core/form/FormButtonLink";

export interface SourceFormControlsProps {
	form?: string;
	onCancel: () => void;
}

export function SourceFormControls(props: SourceFormControlsProps): ReactNode {
	const { form, onCancel } = props;

	const t = useTranslations();

	return (
		<FormControls>
			<FormButtonLink onPress={onCancel}>{t("authenticated.controls.cancel")}</FormButtonLink>
			<FormButton form={form} type="submit">
				{t("authenticated.controls.submit")}
			</FormButton>
		</FormControls>
	);
}
