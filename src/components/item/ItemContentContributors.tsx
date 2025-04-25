import css from "@/components/item/ItemMetadata.module.css";
import type { User } from "@/data/sshoc/api/user";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export interface ItemContentContributorsProps {
	contentContributors: Array<User> | undefined;
}

export function ItemContentContributors(props: ItemContentContributorsProps): JSX.Element | null {
	const { contentContributors } = props;

	const { t } = useI18n<"common">();

	if (contentContributors == null) {
		return <LoadingIndicator />;
	}

	if (contentContributors.length === 0) {
		return null;
	}

	return (
		<div className={css["group"]}>
			<dt className={css["group-label"]}>
				{t(["common", "item", "content-contributors", "other"])}
			</dt>
			<dd>
				<ul role="list" className={css["group-items"]}>
					{contentContributors.map((contributor) => {
						return (
							<li key={contributor.id}>
								<div>{contributor.displayName}</div>
							</li>
						);
					})}
				</ul>
			</dd>
		</div>
	);
}
