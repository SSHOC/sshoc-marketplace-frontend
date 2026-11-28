import css from "@/lib/core/ui/Facet/Facet.module.css";

import type { ReactNode } from "react";
import { Button, Disclosure, DisclosurePanel } from "react-aria-components";

import { CheckBoxGroup, type CheckBoxGroupProps } from "@/lib/core/ui/CheckBoxGroup/CheckBoxGroup";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import TriangleIcon from "@/lib/core/ui/icons/triangle";

export interface FacetDisclosureProps {
	label: string;
	headingLevel?: 1 | 2 | 3 | 4;
	defaultOpen?: boolean;
	isOpen?: boolean;
	children?: ReactNode;
}

export interface FacetProps extends CheckBoxGroupProps, Omit<FacetDisclosureProps, "children"> {
	label: string;
	controls?: ReactNode;
}

export function Facet(props: FacetProps): ReactNode {
	const { controls, headingLevel, label, defaultOpen, isOpen, ...checkBoxGroupProps } = props;
	return (
		<FacetDisclosure
			label={label}
			headingLevel={headingLevel}
			defaultOpen={defaultOpen}
			isOpen={isOpen}
		>
			<CheckBoxGroup aria-label={label} {...checkBoxGroupProps} variant="facet" />
			{controls != null ? <div className={css["controls"]}>{controls}</div> : null}
		</FacetDisclosure>
	);
}

export function FacetDisclosure({
	children,
	headingLevel = 3,
	label,
	defaultOpen,
	isOpen,
}: FacetDisclosureProps): ReactNode {
	const Heading = `h${headingLevel}` as const;
	return (
		<Disclosure className={css["container"]} defaultExpanded={defaultOpen} isExpanded={isOpen}>
			{({ isExpanded }) => (
				<>
					<Heading className={css["heading"]}>
						<Button slot="trigger" className={css["button"]}>
							{label}
							<Icon icon={TriangleIcon} />
						</Button>
					</Heading>
					<DisclosurePanel>{isExpanded ? children : null}</DisclosurePanel>
				</>
			)}
		</Disclosure>
	);
}

export { Item } from "@/lib/core/ui/CheckBoxGroup/CheckBoxGroup";
