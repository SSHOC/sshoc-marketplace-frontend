import type { DocumentRendererProps } from "@keystatic/core/renderer";

import { Link } from "@/components/link";

type Renderers = NonNullable<DocumentRendererProps["renderers"]>;
type InlineRenderers = NonNullable<Renderers["inline"]>;

export const link: InlineRenderers["link"] = Link;
