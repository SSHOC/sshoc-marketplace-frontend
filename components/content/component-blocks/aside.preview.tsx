import type { ObjectField, PreviewProps } from "@keystatic/core";

import type { schema } from "@/components/content/component-blocks/aside";

export const preview = function Preview(props: PreviewProps<ObjectField<typeof schema>>) {
	return <aside>{props.fields.content.element}</aside>;
};
