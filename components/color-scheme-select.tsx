"use client";

import { useTheme } from "next-themes";
import type { ChangeEvent, ReactNode } from "react";

interface ColorSchemeSelectProps {
	colorSchemes: Record<string, string>;
}

export function ColorSchemeSelect(props: ColorSchemeSelectProps): ReactNode {
	const { colorSchemes } = props;

	const { theme, setTheme } = useTheme();

	function onChange(event: ChangeEvent<HTMLSelectElement>) {
		const theme = event.currentTarget.value;

		setTheme(theme);
	}

	return (
		<select onChange={onChange} value={theme}>
			{Object.entries(colorSchemes).map(([id, label]) => {
				return (
					<option key={id} value={id}>
						{label}
					</option>
				);
			})}
		</select>
	);
}
