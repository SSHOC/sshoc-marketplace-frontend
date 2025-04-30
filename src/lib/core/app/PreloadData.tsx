import type { ReactNode } from "react";

import { createUrl } from "@/data/sshoc/lib/client";

export function PreloadData(): ReactNode {
	return (
		<link
			rel="preload"
			as="fetch"
			href={String(createUrl({ pathname: "/api/items-categories" }))}
			crossOrigin="anonymous"
			type="application/json"
		/>
	);
}
