import { Ubuntu } from "next/font/google";

export const body = Ubuntu({
	display: "swap",
	style: ["normal", "italic"],
	subsets: ["latin", "latin-ext"],
	variable: "--font-body",
	weight: ["400", "500", "700"],
});

export const heading = Ubuntu({
	display: "swap",
	style: ["normal", "italic"],
	subsets: ["latin", "latin-ext"],
	variable: "--font-heading",
	weight: ["400", "500", "700"],
});
