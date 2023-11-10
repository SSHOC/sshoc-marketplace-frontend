"use client";

import type { ObjectField, PreviewProps } from "@keystatic/core";

import type { schema } from "@/components/content/component-blocks/download";
import { useObjectUrl } from "@/lib/content/use-object-url";

export const preview = function Preview(props: PreviewProps<ObjectField<typeof schema>>) {
	const buffer = props.fields.file.value?.data.buffer;

	const href = useObjectUrl(buffer);

	return (
		<a href={href} download={props.fields.file.value?.filename}>
			{props.fields.label.element}
		</a>
	);
};
