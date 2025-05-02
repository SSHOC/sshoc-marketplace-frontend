import { Head, Html, Main, NextScript } from "next/document";
import type { ReactNode } from "react";

import { PreloadData } from "@/lib/core/app/PreloadData";
import { isNonEmptyString } from "@/lib/utils";
import { googleSiteId } from "~/config/site.config";

export default function Document(): ReactNode {
	return (
		<Html className="font-body antialiased">
			<Head>
				<PreloadData />
				{isNonEmptyString(googleSiteId) ? (
					<meta name="google-site-verification" content={googleSiteId} />
				) : null}
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
