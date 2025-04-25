import { createUrlSearchParams } from "@stefanprobst/request";
import type { ReactNode, SVGProps, VFC } from "react";

import type { UserRole } from "@/data/sshoc/api/user";
import { useCurrentUser } from "@/data/sshoc/hooks/auth";
import { useI18n } from "@/lib/core/i18n/useI18n";
import ActorsIcon from "~/public/assets/images/account/actors.svg?symbol-icon";
import ContributedItemsIcon from "~/public/assets/images/account/contributed-items.svg?symbol-icon";
import DraftItemsIcon from "~/public/assets/images/account/draft-items.svg?symbol-icon";
import ModerateItemsIcon from "~/public/assets/images/account/moderate-items.svg?symbol-icon";
import SourcesIcon from "~/public/assets/images/account/sources.svg?symbol-icon";
import UsersIcon from "~/public/assets/images/account/users.svg?symbol-icon";
import VocabulariesIcon from "~/public/assets/images/account/vocabularies.svg?symbol-icon";

export interface AccountLink {
	href: string;
	label: string;
	icon: VFC<SVGProps<SVGSVGElement> & { title?: ReactNode }>;
	roles: Array<UserRole>;
}

export type AccountLinks = Array<AccountLink>;

export function useAccountLinks(): AccountLinks {
	const { t } = useI18n<"authenticated" | "common">();
	const currentUser = useCurrentUser();

	if (currentUser.data == null) {
		return [];
	}

	const links: AccountLinks = [
		{
			href: `/account/contributed-items`,
			label: t(["authenticated", "pages", "contributed-items"]),
			icon: ContributedItemsIcon,
			roles: ["administrator", "moderator", "contributor"],
		},
		{
			href: `/account/draft-items`,
			label: t(["authenticated", "pages", "draft-items"]),
			icon: DraftItemsIcon,
			roles: ["administrator", "moderator", "contributor"],
		},
		{
			href: `/account/moderate-items?${createUrlSearchParams({ "d.status": "(suggested OR ingested)" })}`,
			label: t(["authenticated", "pages", "moderate-items"]),
			icon: ModerateItemsIcon,
			roles: ["administrator", "moderator"],
		},
		{
			href: `/account/actors`,
			label: t(["authenticated", "pages", "actors"]),
			icon: ActorsIcon,
			roles: ["administrator", "moderator"],
		},
		{
			href: `/account/sources`,
			label: t(["authenticated", "pages", "sources"]),
			icon: SourcesIcon,
			roles: ["administrator"],
		},
		{
			href: `/account/users`,
			label: t(["authenticated", "pages", "users"]),
			icon: UsersIcon,
			roles: ["administrator"],
		},
		{
			href: `/account/vocabularies`,
			label: t(["authenticated", "pages", "vocabularies"]),
			icon: VocabulariesIcon,
			roles: ["administrator", "moderator"],
		},
	];

	const allowed = links.filter((link) => {
		return link.roles.includes(currentUser.data.role);
	});

	return allowed;
}
