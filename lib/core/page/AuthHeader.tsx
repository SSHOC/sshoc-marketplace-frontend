import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { useAuth } from "@/lib/core/auth/useAuth";
import { useCreateItemLinks } from "@/lib/core/page/useCreateItemLinks";

export function AuthHeader(): ReactNode {
	const t = useTranslations();
	const items = useCreateItemLinks();
	const { isSignedIn } = useAuth();

	if (!isSignedIn || items.length === 0) {
		return null;
	}

	return (
		<nav
			aria-label={t("common.create-new-items")}
			className="-mt-px hidden border-y border-primary-100 bg-primary-25 xl:block"
		>
			<ul
				role="list"
				className="mx-auto flex w-full max-w-[120rem] items-center justify-end px-8 text-sm"
			>
				{items.map((item, index) => {
					return (
						<li key={index}>
							<Link
								className="inline-flex px-6 py-4 text-center text-primary-700 transition hover:text-primary-600 focus-visible:text-primary-600"
								href={item.href}
							>
								{item.label}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
