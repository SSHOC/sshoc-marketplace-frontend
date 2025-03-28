import type { ReactNode } from "react";

export function TouchTarget(): ReactNode {
	return <span className="pointer-fine:hidden absolute top-1/2 left-1/2 size-12 -translate-1/2" />;
}
