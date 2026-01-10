import { Fragment, type ReactNode } from "react";
import {
	CheckboxGroup as AriaCheckboxGroup,
	type CheckboxGroupProps as AriaCheckboxGroupProps,
	composeRenderProps,
	Label as AriaLabel,
} from "react-aria-components";

interface CheckBoxGroupProps extends AriaCheckboxGroupProps {
	label: ReactNode;
}

export function CheckBoxGroup(props: Readonly<CheckBoxGroupProps>): ReactNode {
	const { children, label, ...rest } = props;

	return (
		<AriaCheckboxGroup {...rest} className="inline-flex w-full min-w-24 flex-col gap-1">
			{composeRenderProps(children, (children) => {
				return (
					<Fragment>
						<AriaLabel>{label}</AriaLabel>
						<div className="flex flex-col gap-1">{children}</div>
					</Fragment>
				);
			})}
		</AriaCheckboxGroup>
	);
}
