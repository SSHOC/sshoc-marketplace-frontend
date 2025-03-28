import { AsteriskIcon } from "lucide-react";
import type { ReactNode } from "react";

export function RequiredIndicator(): ReactNode {
	return (
		<AsteriskIcon className="size-3.5 shrink-0 self-start text-neutral-800 group-disabled:text-neutral-300" />
	);
}
