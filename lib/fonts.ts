import { Ubuntu_Sans, Ubuntu_Sans_Mono } from "next/font/google";

export const body = Ubuntu_Sans({
	style: ["normal", "italic"],
	subsets: ["latin", "latin-ext"],
	variable: "--_font-body",
});

export const mono = Ubuntu_Sans_Mono({
	style: ["normal", "italic"],
	subsets: ["latin", "latin-ext"],
	variable: "--_font-mono",
});
