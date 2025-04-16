import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/ui/main-content";
import { getWorkflow } from "@/lib/api/client";

interface WorkflowPageProps {
	params: Promise<{
		persistentId: string;
	}>;
}

export async function generateMetadata(
	props: Readonly<WorkflowPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { persistentId: _persistentId } = await params;
	const persistentId = decodeURIComponent(_persistentId);

	const item = await getWorkflow(persistentId);

	const metadata: Metadata = {
		title: item.label,
	};

	return metadata;
}

export default async function WorkflowPage(props: Readonly<WorkflowPageProps>): Promise<ReactNode> {
	const { params } = props;

	const { persistentId: _persistentId } = await params;
	const persistentId = decodeURIComponent(_persistentId);

	const t = await getTranslations("WorkflowPage");

	const item = await getWorkflow(persistentId);

	return (
		<MainContent>
			<section>
				<h1>{item.label}</h1>
			</section>

			<pre>{JSON.stringify(item, null, 2)}</pre>
		</MainContent>
	);
}
