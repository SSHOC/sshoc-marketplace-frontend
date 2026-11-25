import { createUrlSearchParams } from "@stefanprobst/request";
import { useTranslations } from "next-intl";
import type { ReactNode, SVGProps, FC } from "react";

import type { UserRole } from "@/data/sshoc/api/user";
import { useCurrentUser } from "@/data/sshoc/hooks/auth";
import ActorsIcon from "@/lib/core/ui/icons/account-actors";
import ContributedItemsIcon from "@/lib/core/ui/icons/account-contributed-items";
import DraftItemsIcon from "@/lib/core/ui/icons/account-draft-items";
import ModerateItemsIcon from "@/lib/core/ui/icons/account-moderate-items";
import SourcesIcon from "@/lib/core/ui/icons/account-sources";
import UsersIcon from "@/lib/core/ui/icons/account-users";
import VocabulariesIcon from "@/lib/core/ui/icons/account-vocabularies";

export interface AccountLink {
	href: string;
	label: string;
	icon: FC<SVGProps<SVGSVGElement> & { title?: ReactNode }>;
	roles: Array<UserRole>;
}

export type AccountLinks = Array<AccountLink>;

export function useAccountLinks(): AccountLinks {
	const t = useTranslations();
	const currentUser = useCurrentUser();

	if (currentUser.data == null) {
		return [];
	}

	const links: AccountLinks = [
		{
			href: `/account/contributed-items`,
			label: t("authenticated.pages.contributed-items"),
			icon: ContributedItemsIcon,
			roles: ["administrator", "moderator", "contributor"],
		},
		{
			href: `/account/draft-items`,
			label: t("authenticated.pages.draft-items"),
			icon: DraftItemsIcon,
			roles: ["administrator", "moderator", "contributor"],
		},
		{
			href: `/account/moderate-items?${createUrlSearchParams({ "d.status": "(suggested OR ingested)" })}`,
			label: t("authenticated.pages.moderate-items"),
			icon: ModerateItemsIcon,
			roles: ["administrator", "moderator"],
		},
		{
			href: `/account/actors`,
			label: t("authenticated.pages.actors"),
			icon: ActorsIcon,
			roles: ["administrator", "moderator"],
		},
		{
			href: `/account/sources`,
			label: t("authenticated.pages.sources"),
			icon: SourcesIcon,
			roles: ["administrator"],
		},
		{
			href: `/account/users`,
			label: t("authenticated.pages.users"),
			icon: UsersIcon,
			roles: ["administrator"],
		},
		{
			href: `/account/vocabularies`,
			label: t("authenticated.pages.vocabularies"),
			icon: VocabulariesIcon,
			roles: ["administrator", "moderator"],
		},
	];

	const allowed = links.filter((link) => {
		return link.roles.includes(currentUser.data.role);
	});

	return allowed;
}
