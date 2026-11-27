import css from "@/components/item/CopyLinkToClipboardButton.module.css";

import { useTranslations } from "next-intl";
import type { ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import { Button } from "react-aria-components";

import { Icon } from "@/lib/core/ui/Icon/Icon";
import LinkIcon from "@/lib/core/ui/icons/link";
import { createSiteUrl } from "@/lib/utils";

export interface CopyLinkToClipboardButtonProps {
	pathname: string;
}

// FIXME: shoud use <Button variant="ghost" /> or similar
export const CopyLinkToClipboardButton = forwardRef(function CopyLinkToClipboardButton(
	props: CopyLinkToClipboardButtonProps,
	forwardedRef: ForwardedRef<HTMLButtonElement>,
): ReactNode {
	const { pathname } = props;

	const t = useTranslations();
	function onPress() {
		const url = createSiteUrl({ pathname });
		window.navigator.clipboard.writeText(String(url));
	}

	const label = t("common.search.copy-to-clipboard");

	return (
		<Button onPress={onPress} className={css["button"]} ref={forwardedRef}>
			<Icon icon={LinkIcon} />
			{label}
		</Button>
	);
});
