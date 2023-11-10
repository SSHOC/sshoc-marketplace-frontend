import { MoonIcon, SunIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useMemo } from "react";

import { ColorSchemeSelect } from "@/components/color-scheme-select";

export function ColorSchemeSwitcher(): ReactNode {
	const t = useTranslations("ColorSchemeSwitcher");

	const colorSchemes = useMemo(() => {
		return Object.fromEntries(
			(["system", "light", "dark"] as const).map((id) => {
				return [id, t(`color-schemes.${id}`)];
			}),
		);
	}, [t]);

	return (
		<label>
			<span className="sr-only">{t("change-color-scheme")}</span>
			<ColorSchemeSelect colorSchemes={colorSchemes} />
		</label>
	);
}
