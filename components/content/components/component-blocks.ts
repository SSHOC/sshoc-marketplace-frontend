import type { InferRenderersForComponentBlocks } from "@keystatic/core";

import type { aside } from "@/components/content/component-blocks/aside";
import type { download } from "@/components/content/component-blocks/download";
import type { embed } from "@/components/content/component-blocks/embed";
import type { figure } from "@/components/content/component-blocks/figure";

export type ComponentBlocks = InferRenderersForComponentBlocks<{
	aside: typeof aside;
	download: typeof download;
	embed: typeof embed;
	figure: typeof figure;
}>;
