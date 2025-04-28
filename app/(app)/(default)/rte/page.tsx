import type { ReactNode } from "react";

import { TestEditor } from "@/app/(app)/(default)/rte/_components/test-editor";
import { MainContent } from "@/components/ui/main-content";

export default function RichTextEditorPage(): ReactNode {
	return (
		<MainContent>
			<TestEditor />
		</MainContent>
	);
}
