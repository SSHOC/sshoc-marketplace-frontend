import { Fragment, type ReactNode } from "react";

import css from "@/components/account/AccountHelpText.module.css";
import { Link } from "@/components/common/Link";
import type { UserRole } from "@/data/sshoc/api/user";
import { useCurrentUser } from "@/data/sshoc/hooks/auth";
import { includes, keys } from "@/lib/utils";

type NonSystemUserRole = Exclude<UserRole, "system-contributor" | "system-moderator">;

const texts: Record<NonSystemUserRole, ReactNode> = {
	administrator: (
		<Fragment>
			Dear administrator of the SSH Open Marketplace, welcome to the curation dashboard! As any
			contributor, you can find here the list of items you have contributed to as well as the list
			of your draft items. As any moderator, you can also access the list of items to moderate and
			manage the actors referenced in the Marketplace. And because of your administrator status, you
			can also manage sources and users. Please consult the{" "}
			<Link href="/contribute/overview">contribute pages</Link> if you need some guidance.
		</Fragment>
	),
	contributor: (
		<Fragment>
			Dear contributor to the SSH Open Marketplace, welcome to the curation dashboard of the SSH
			Open Marketplace! You can find here the list of items you have contributed to as well as the
			list of your draft items. Now that you are logged in, you can create and edit items. Please
			consult the <Link href="/contribute/overview">contributor guidelines</Link> if you need to be
			guided in the process.
		</Fragment>
	),
	moderator: (
		<Fragment>
			Dear moderator of the SSH Open Marketplace, welcome to the curation dashboard! As any
			contributor, you can find here the list of items you have contributed to as well as the list
			of your draft items. Because of your moderator status, you can also access the list of items
			to moderate and manage the actors referenced in the Marketplace. Please consult the{" "}
			<Link href="/contribute/overview">contribute pages</Link> if you need some guidance.
		</Fragment>
	),
};

export function AccountHelpText(): ReactNode {
	const currentUser = useCurrentUser();

	const role = currentUser.data?.role;

	if (role == null || !includes(keys(texts), role)) {
		return null;
	}

	const text = texts[role];

	return (
		<div className={css["lead"]}>
			<p className={css["text"]}>
				Hi, {currentUser.data?.displayName} (
				<a className={css["email"]} href={`mailto:${currentUser.data?.email}`}>
					{currentUser.data?.email}
				</a>
				)!
			</p>
			<p className={css["text"]}>{text}</p>
		</div>
	);
}
