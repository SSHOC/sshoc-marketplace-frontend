import { useId } from "@react-aria/utils";
import type { HTMLAttributes } from "react";

import type { DisclosureState } from "@/lib/core/ui/hooks/useDisclosureState";

export interface DisclosureAria {
	triggerProps: HTMLAttributes<HTMLElement>;
	contentProps: HTMLAttributes<HTMLElement>;
}

export function useDisclosure(state: DisclosureState): DisclosureAria {
	const id = useId();
	const panelId = useId();

	return {
		triggerProps: {
			id,
			"aria-controls": state.isOpen ? panelId : undefined,
			"aria-expanded": state.isOpen,
		},
		contentProps: {
			id: panelId,
			"aria-labelledby": id,
		},
	};
}
