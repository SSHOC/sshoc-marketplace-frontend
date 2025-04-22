import type { ItemStatus } from "@/lib/api/client";

export function is(status: ItemStatus, action: "deletable" | "editable"): boolean {
	switch (action) {
		case "deletable": {
			return ["approved", "draft", "ingested", "suggested"].includes(status);
		}

		case "editable": {
			return ["approved", "draft", "ingested", "suggested"].includes(status);
		}
	}
}
