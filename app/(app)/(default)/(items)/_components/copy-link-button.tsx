"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface CopyLinkButtonProps extends Omit<ComponentPropsWithRef<typeof Button>, "onPress"> {
	href: string;
}

export function CopyLinkButton(props: Readonly<CopyLinkButtonProps>): ReactNode {
	const { children, href, ...rest } = props;

	return (
		<Button
			{...rest}
			onPress={() => {
				void window.navigator.clipboard.writeText(href);
			}}
		>
			{children}
		</Button>
	);
}
