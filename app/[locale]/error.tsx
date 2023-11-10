"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useEffect } from "react";

import { MainContent } from "@/components/main-content";

interface ErrorProps {
	error: Error;
	reset: () => void;
}

export default function Error(props: ErrorProps): ReactNode {
	const { error, reset } = props;

	const t = useTranslations("Error");

	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<MainContent className="container py-8">
			<h1>{t("something-went-wrong")}</h1>
			<button onClick={reset}>{t("try-again")}</button>
		</MainContent>
	);
}
