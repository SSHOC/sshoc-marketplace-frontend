"use client";

import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { createHref } from "@/lib/create-href";

interface SkipLinkProps {
	children: ReactNode;
	id?: string;
	targetId: string;
}

export function SkipLink(props: Readonly<SkipLinkProps>): ReactNode {
	const { children, id, targetId } = props;

	/**
	 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=308064
	 */
	function onClick() {
		document.getElementById(targetId)?.focus();
	}

	return (
		<Link
			className="bg-background text-on-background fixed z-50 -translate-y-full rounded px-4 py-3 transition focus:translate-y-0"
			href={createHref({ hash: targetId })}
			id={id}
			onClick={onClick}
		>
			{children}
		</Link>
	);
}
