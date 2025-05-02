import { defaultItemSearchResultsSortOrder } from "@/config/sshoc.config";
import { isEmptyArray, isEmptyString } from "@/lib/utils";

export function sanitizeSearchParams<T extends object>(obj: T): T {
	return Object.fromEntries(
		Object.entries(obj).filter(([key, value]) => {
			if (value == null) {
				return false;
			}
			if (isEmptyArray(value)) {
				return false;
			}
			if (isEmptyString(value)) {
				return false;
			}

			if (key === "page" && value === 1) {
				return false;
			}
			if (key === "order" && value === defaultItemSearchResultsSortOrder) {
				return false;
			}

			return true;
		}),
	) as T;
}
