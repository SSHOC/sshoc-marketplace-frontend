import css from "@/components/common/SearchFacetsOverlay.module.css";
import buttonCss from "@/lib/core/ui/Button/Button.module.css";
import linkCss from "@/lib/core/ui/Link/Link.module.css";

import cx from "clsx";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useCallback, useContext, useRef } from "react";
import { Button, ButtonContext, Disclosure, DisclosurePanel } from "react-aria-components";

import { CloseButton } from "@/lib/core/ui/CloseButton/CloseButton";

interface SearchFacetsOverlayProps {
	title: string;
	hasMoreItems: boolean;
	renderFacet: (controls?: ReactNode) => ReactNode;
	children: () => ReactNode;
}

export function SearchFacetsOverlay(props: SearchFacetsOverlayProps): ReactNode {
	return (
		<Disclosure>
			{({ isExpanded, state }) => (
				<FacetDisclosureContent {...props} isExpanded={isExpanded} collapse={state.collapse} />
			)}
		</Disclosure>
	);
}

function FacetDisclosureContent({
	title,
	hasMoreItems,
	renderFacet,
	children,
	isExpanded,
	collapse,
}: SearchFacetsOverlayProps & { isExpanded: boolean; collapse: () => void }): ReactNode {
	const t = useTranslations();
	const buttonContext = useContext(ButtonContext);
	const restoreFocus = useRef(false);
	const triggerRef = useCallback((button: HTMLButtonElement | null) => {
		if (button && restoreFocus.current) {
			restoreFocus.current = false;
			button.focus();
		}
	}, []);

	function close() {
		restoreFocus.current = true;
		collapse();
	}

	const controls = hasMoreItems ? (
		// The compact facet has its own disclosure and trigger slot.
		<ButtonContext.Provider value={buttonContext}>
			<Button
				ref={triggerRef}
				slot="trigger"
				className={cx(linkCss["link"], buttonCss["button-link"])}
			>
				{t("common.search.show-more")}
			</Button>
		</ButtonContext.Provider>
	) : undefined;

	return (
		<>
			{isExpanded ? null : renderFacet(controls)}
			<DisclosurePanel aria-label={title}>
				{isExpanded ? (
					<div
						className={css["container"]}
						onKeyDown={(event) => {
							if (event.key === "Escape") {
								event.stopPropagation();
								close();
							}
						}}
					>
						<header className={css["header"]}>
							<h3 className={css["title"]}>{title}</h3>
							<CloseButton
								aria-label={t("common.search.show-less")}
								autoFocus
								onPress={close}
								size="lg"
							/>
						</header>
						<div className={css["content"]}>{children()}</div>
					</div>
				) : null}
			</DisclosurePanel>
		</>
	);
}
