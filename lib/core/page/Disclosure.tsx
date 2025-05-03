import type { ReactNode } from "react";
import {
	Button as AriaButton,
	Disclosure as AriaDisclosure,
	DisclosurePanel,
} from "react-aria-components";

import { Icon } from "@/lib/core/ui/Icon/Icon";
import TriangleIcon from "@/lib/core/ui/icons/triangle.svg?symbol-icon";

export interface DisclosureProps {
	label: string;
	children?: ReactNode;
	className?: string;
}

export function Disclosure(props: DisclosureProps): ReactNode {
	return (
		<AriaDisclosure>
			<AriaButton className={props.className} data-state={state.isOpen ? "expanded" : "collapsed"}>
				<span>{props.label}</span>
				<Icon icon={TriangleIcon} />
			</AriaButton>
			<DisclosurePanel>{props.children}</DisclosurePanel>
		</AriaDisclosure>
	);
}
