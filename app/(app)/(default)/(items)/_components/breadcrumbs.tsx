import { ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";

import { NavLink } from "@/components/nav-link";

interface BreadcrumbsProps {
	items: Array<{ href: string; label: string }>;
	label: string;
}

export function Breadcrumbs(props: Readonly<BreadcrumbsProps>): ReactNode {
	const { items, label } = props;

	return (
		<nav aria-label={label}>
			<ol className="flex items-center">
				{items.map((item, index, items) => {
					const isCurrent = index === items.length - 1;

					return (
						<li key={index} className="inline-flex gap-x-2">
							<NavLink
								aria-current={isCurrent ? "page" : undefined}
								className="hover:underline focus-visible:outline-2 current:font-bold"
								href={item.href}
								isDisabled={isCurrent}
							>
								{item.label}
							</NavLink>
							{!isCurrent ? (
								<ChevronRightIcon
									aria-hidden={true}
									className="size-4 shrink-0 text-neutral-500"
									data-slot="icon"
								/>
							) : null}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
