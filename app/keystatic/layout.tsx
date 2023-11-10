import type { Metadata } from "next";
import type { ReactNode } from "react";

import KeystaticApp from "@/app/keystatic/keystatic";

export const metadata: Metadata = {
	robots: {
		index: false,
	},
};

export default function RootLayout(): ReactNode {
	return (
		<html lang="en">
			<head />
			<body>
				<KeystaticApp />
			</body>
		</html>
	);
}
