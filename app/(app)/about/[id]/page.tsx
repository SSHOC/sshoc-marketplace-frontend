import type { Metadata, ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { createCollectionResource } from "@/lib/keystatic/resources";

interface AboutPageProps {
	params: Promise<{
		id: string;
	}>;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<AboutPageProps["params"]>, "id">>
> {
	const locale = await getLocale();
	const ids = await createCollectionResource("about-pages", locale).list();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(
	props: Readonly<AboutPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const locale = await getLocale();

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const entry = await createCollectionResource("about-pages", locale).read(id);
	const { title } = entry.data;

	const metadata: Metadata = {
		title,
	};

	return metadata;
}

export default async function AboutPage(props: Readonly<AboutPageProps>): Promise<ReactNode> {
	const { params } = props;

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const locale = await getLocale();

	const entry = await createCollectionResource("about-pages", locale).read(id);
	const { content, title } = entry.data;
	const { default: Content } = await entry.compile(content);

	return (
		<MainContent className="layout-grid">
			<section className="layout-subgrid relative bg-fill-weaker py-24">
				<h1>{title}</h1>
				<div className="prose">
					<Content />
				</div>
			</section>
		</MainContent>
	);
}
