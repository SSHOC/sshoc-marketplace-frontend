import css from "@/components/item/ItemAccessibleAtLinks.module.css";
import buttonCss from "@/lib/core/ui/Button/Button.module.css";
import menuCss from "@/lib/core/ui/Menu/Menu.module.css";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Button, Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";

import type { Item } from "@/data/sshoc/api/item";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import ChevronIcon from "@/lib/core/ui/icons/chevron";
import LinkIcon from "@/lib/core/ui/icons/external-link";
import { LinkButton } from "@/lib/core/ui/Link/LinkButton";

export interface ItemAccessibleAtLinksProps {
	category: Item["category"];
	links: Item["accessibleAt"];
}

export function ItemAccessibleAtLinks(props: ItemAccessibleAtLinksProps): ReactNode {
	const { category, links } = props;

	const t = useTranslations();

	if (links.length === 0) {
		return null;
	}

	if (links.length === 1) {
		return (
			<div className={css["link-button"]}>
				<LinkButton href={links[0]!} target="_blank" rel="noreferrer">
					{t("common.item.go-to-item", {
						item: t(`common.item-categories.${category}.one`),
					})}
					<Icon icon={LinkIcon} />
				</LinkButton>
			</div>
		);
	}

	return <ItemAccessibleAtLinksMenuButton category={category} links={links} />;
}

function ItemAccessibleAtLinksMenuButton(props: ItemAccessibleAtLinksProps): ReactNode {
	const { category, links } = props;

	const t = useTranslations();

	return (
		<div className={css["link-button"]}>
			<MenuTrigger>
				<Button
					className={`${buttonCss["button"]} ${menuCss["trigger"]}`}
					data-color="primary"
					data-size="md"
					data-variant="fill"
				>
					{t("common.item.go-to-item", {
						item: t(`common.item-categories.${category}.one`),
					})}
					<Icon icon={ChevronIcon} width="0.75em" />
				</Button>
				<Popover className={menuCss["popover"]} placement="bottom start" offset={6}>
					<Menu className={menuCss["menu"]}>
						{links.map((href, index) => (
							<MenuItem
								key={`${href}-${index}`}
								id={`${href}-${index}`}
								href={href}
								target="_blank"
								rel="noreferrer"
								className={menuCss["menu-item"]}
							>
								{href}
							</MenuItem>
						))}
					</Menu>
				</Popover>
			</MenuTrigger>
		</div>
	);
}
