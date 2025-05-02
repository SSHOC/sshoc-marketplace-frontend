import type { Dictionary as AuthenticatedDictionary } from "@/dictionaries/authenticated";
import type { Dictionary as CommonDictionary } from "@/dictionaries/common";

export interface Dictionary {
	authenticated: AuthenticatedDictionary;
	common: CommonDictionary;
}

export type Plurals = Partial<Record<Intl.LDMLPluralRule, string>>;
