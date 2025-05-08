import { Head, Html, Main, NextScript } from "next/document";
import type { ReactNode } from "react";

import { PreloadData } from "@/lib/core/app/PreloadData";

export default function Document(): ReactNode {
	return (
		<Html className="font-body antialiased">
			<Head>
				<PreloadData />
			</Head>

			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
