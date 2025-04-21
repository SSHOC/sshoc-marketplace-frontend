import type { GetCurrentUser, ItemCategory } from "@/lib/api/client";

export function can(
	user: GetCurrentUser.Response,
	resource: ItemCategory,
	action: "delete" | "edit" | "publish",
): boolean {
	switch (resource) {
		case "dataset":
		case "publication":
		case "step":
		case "tool-or-service":
		case "training-material":
		case "workflow": {
			switch (action) {
				case "delete": {
					return ["administrator"].includes(user.role);
				}

				case "edit": {
					return ["administrator", "contributor", "moderator"].includes(user.role);
				}

				case "publish": {
					return ["administrator"].includes(user.role);
				}
			}
		}
	}
}
