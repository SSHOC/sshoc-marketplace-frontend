import { mergeProps } from "@react-aria/utils";
import { useField } from "react-final-form";

import { useFormFieldValidationState } from "@/lib/core/form/useFormFieldValidationState";
import type { ThumbnailProps } from "@/lib/core/ui/Thumbnail/Thumbnail";
import { Thumbnail } from "@/lib/core/ui/Thumbnail/Thumbnail";
import { identity } from "@/lib/utils";

export interface FormThumbnailProps extends Omit<ThumbnailProps, "value"> {
	name: string;
}

export function FormThumbnail(props: FormThumbnailProps): JSX.Element {
	const { input, meta } = useField(props.name, {
		allowNull: true,
		parse: identity,
		format: identity,
	});
	const validation = useFormFieldValidationState(meta);

	return (
		<Thumbnail
			color="form"
			{...mergeProps(props, {
				onBlur: input.onBlur,
				onFocus: input.onFocus,
				onChange: input.onChange,
				value: input.value,
				...validation,
			})}
		/>
	);
}
