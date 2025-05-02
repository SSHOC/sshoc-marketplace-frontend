import { Ubuntu } from "next/font/google";

export const body = Ubuntu({
	style: ["normal", "italic"],
	subsets: ["latin", "latin-ext"],
	variable: "--_font-body",
	weight: ["400", "500", "700"],
});
