import { formatISO } from "date-fns";
import { useMemo } from "react";

import { defaultModerateItemsSortOrder, isModerateItemSortOrder } from "@/config/sshoc.config";
import type { ItemSearch, ItemStatus } from "@/data/sshoc/api/item";
import { isItemCategory, isItemStatus } from "@/data/sshoc/api/item";
import type { User } from "@/data/sshoc/api/user";
import type { IsoDateString } from "@/data/sshoc/lib/types";
import type { CurationFlag } from "@/data/sshoc/utils/curation";
import { isCurationFlag } from "@/data/sshoc/utils/curation";
import { useSearchParams } from "@/lib/core/navigation/useSearchParams";
import { toPositiveInteger } from "@/lib/utils";

const defaultItemStatus: Array<ItemStatus> = ["suggested"];

export type SearchFilters = Pick<
	ItemSearch.SearchParams,
	"categories" | "f.activity" | "f.keyword" | "f.language" | "f.source" | "order" | "page" | "q"
> & {
	/**
	 * The backend expects dynamic properties as flat string queries which can be passed
	 * directly to olr But on the client it makes more sense to store array values.
	 * They are converted back to the shape the backend expects with `convertDynamicSearchParams`.
	 */
	"d.status"?: Array<ItemStatus>;
	"d.owner"?: Array<User["username"]>;
	"d.lastInfoUpdate"?: Array<IsoDateString>;
	/**
	 * The backend expects every curation flag as a separate booleanish search param, but it makes
	 * more sense to treat them as a list for client-side filtering.
	 */
	"d.curation"?: Array<CurationFlag>;
	"d.deprecated-at-source": boolean;
	"d.conflict-at-source": boolean;
};

export function useModerateItemsSearchFilters(): Required<SearchFilters> {
	const searchParams = useSearchParams();

	const searchFilters = useMemo(() => {
		const defaultSearchFilters: Required<SearchFilters> = {
			page: 1,
			order: [defaultModerateItemsSortOrder],
			q: "",
			categories: [],
			"f.activity": [],
			"f.keyword": [],
			"f.language": [],
			"f.source": [],
			"d.status": defaultItemStatus,
			"d.owner": [],
			"d.lastInfoUpdate": [],
			"d.curation": [],
			"d.deprecated-at-source": false,
			"d.conflict-at-source": false,
		};

		if (searchParams == null) {
			return defaultSearchFilters;
		}

		const _page = searchParams.get("page");
		const page = toPositiveInteger(_page) ?? 1;

		const _order = searchParams.getAll("order").filter(isModerateItemSortOrder);
		const order = _order.length > 0 ? _order : [defaultModerateItemsSortOrder];

		const _status = searchParams.getAll("d.status").filter(isItemStatus);
		const status = _status.length > 0 ? _status : defaultItemStatus;

		const curation = searchParams.getAll("d.curation").filter(isCurationFlag);

		const lastInfoUpdate = searchParams.getAll("d.lastInfoUpdate").map((date) => {
			return formatISO(new Date(date), { representation: "date" });
		});

		const searchFilters: Required<SearchFilters> = {
			page,
			order,
			q: searchParams.get("q") ?? "",
			categories: searchParams.getAll("categories").filter(isItemCategory),
			"f.activity": searchParams.getAll("f.activity"),
			"f.keyword": searchParams.getAll("f.keyword"),
			"f.language": searchParams.getAll("f.language"),
			"f.source": searchParams.getAll("f.source"),
			"d.status": status,
			"d.owner": searchParams.getAll("d.owner"),
			"d.lastInfoUpdate": lastInfoUpdate,
			"d.curation": curation,
			"d.deprecated-at-source":
				searchParams.get("d.deprecated-at-source")?.toLowerCase() === "true",
			"d.conflict-at-source": searchParams.get("d.conflict-at-source")?.toLowerCase() === "true",
		};

		return searchFilters;
	}, [searchParams]);

	return searchFilters;
}
