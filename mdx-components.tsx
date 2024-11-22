import { Disclosure } from "@/components/content/disclosure";
import { Embed } from "@/components/content/embed";
import { Figure } from "@/components/content/figure";
import { Grid, GridItem } from "@/components/content/grid";
import { Link } from "@/components/content/link";
import { TableOfContents } from "@/components/content/table-of-contents";
import { Tab, Tabs } from "@/components/content/tabs";
import { Video } from "@/components/content/video";
import { Link as Anchor } from "@/components/link";
import { ServerImage as Image } from "@/components/server-image";

const components = {
	a: Anchor,
	Disclosure,
	Embed,
	Figure,
	Grid,
	GridItem,
	img: Image,
	Link,
	Tab,
	TableOfContents,
	Tabs,
	Video,
};

declare global {
	type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
	return components;
}
