import { NotEditable, type ObjectField, type PreviewProps } from "@keystatic/core";

import type { schema } from "@/components/content/component-blocks/figure";
import { PreviewImage } from "@/components/content/component-blocks/preview-image";

export const preview = function Preview(props: PreviewProps<ObjectField<typeof schema>>) {
	const data = props.fields.image.value?.data;

	return (
		<figure>
			<NotEditable>
				<PreviewImage data={data} />
			</NotEditable>
			<figcaption>{props.fields.caption.element}</figcaption>
		</figure>
	);
};
