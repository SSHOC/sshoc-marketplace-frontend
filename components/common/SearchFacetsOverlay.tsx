import { useTranslations } from "next-intl";
import type { HTMLAttributes, ReactNode } from "react";
import { useEffect } from "react";

import css from "@/components/common/SearchFacetsOverlay.module.css";
import { CloseButton } from "@/lib/core/ui/CloseButton/CloseButton";

export interface SearchFacetsOverlay {
	title: string;
	onClose: () => void;
	children?: ReactNode;
	triggerProps: HTMLAttributes<HTMLElement>;
}

export function SearchFacetsOverlay(props: SearchFacetsOverlay): ReactNode {
	const { title, onClose, triggerProps } = props;

	const t = useTranslations();

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				onClose();
			}
		}

		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	});

	return (
		<div className={css["container"]}>
			<header className={css["header"]}>
				<h3 className={css["title"]}>{title}</h3>
				<CloseButton
					{...(triggerProps as any)}
					aria-label={t("common.search.show-less")}
					autoFocus
					onPress={onClose}
					size="lg"
				/>
			</header>
			<div className={css["content"]}>{props.children}</div>
		</div>
	);
}
