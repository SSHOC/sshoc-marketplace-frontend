import { AlertTriangleIcon } from "lucide-react";
import type { ReactNode } from "react";
import { FieldError, Text } from "react-aria-components";

interface HelpTextProps {
	description?: string;
	errorMessage?: string;
}

export function HelpText(props: Readonly<HelpTextProps>): ReactNode {
	const { description, errorMessage } = props;

	return (
		<div className="inline-flex items-center gap-x-2 text-sm">
			<FieldError className="inline-flex items-center gap-x-2">
				<AlertTriangleIcon aria-hidden className="text-negative-500" />
				<div className="text-negative-600">{errorMessage}</div>
			</FieldError>

			<Text className="text-neutral-600" slot="description">
				{description}
			</Text>
		</div>
	);
}
