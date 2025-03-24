"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { type ReactNode, useEffect } from "react";

interface GlobalErrorProps {
	error: Error & { digest?: string };
}

export default function GlobalError(props: Readonly<GlobalErrorProps>): ReactNode {
	const { error } = props;

	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<html lang="en">
			<body>
				<NextError statusCode={0} />
			</body>
		</html>
	);
}
