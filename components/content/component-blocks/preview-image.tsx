"use client";

import type { ReactNode } from "react";

import { useObjectUrl } from "@/lib/content/use-object-url";

interface PreviewImageProps {
	data: Uint8Array | undefined;
}

/**
 * @see https://github.com/Thinkmill/keystatic/issues/765
 */
export function PreviewImage(props: PreviewImageProps): ReactNode {
	const { data } = props;

	const src = useObjectUrl(data?.buffer);

	// eslint-disable-next-line @next/next/no-img-element
	return <img alt="" src={src} />;
}
