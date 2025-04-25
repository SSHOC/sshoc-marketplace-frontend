import { Fragment } from "react";

import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import type { PropertyType } from "@/data/sshoc/api/property";
import { FormTextField } from "@/lib/core/form/FormTextField";
import { useI18n } from "@/lib/core/i18n/useI18n";

export interface ValueTextFieldProps {
	field: ItemFormFields["fields"]["properties"]["fields"]["value"];
	propertyTypeId: PropertyType["code"];
}

export function ValueTextField(props: ValueTextFieldProps): JSX.Element {
	const { field, propertyTypeId } = props;

	const { t } = useI18n<"authenticated" | "common">();

	const description = (
		<Fragment>
			<span>{field.description}</span>
			{/* @ts-expect-error Assume all possible property types have translation. */}
			<span>{t(["authenticated", "properties", propertyTypeId, "description"])}</span>
		</Fragment>
	);

	return <FormTextField {...field} description={description} />;
}
