import { NotEditable, type ObjectField, type PreviewProps } from "@keystatic/core";

import type { schema } from "@/components/content/component-blocks/embed";

export const preview = function Preview(props: PreviewProps<ObjectField<typeof schema>>) {
	return (
		<NotEditable>
			<pre>
				<code>{props.fields.code.value}</code>
			</pre>
		</NotEditable>
	);
};
