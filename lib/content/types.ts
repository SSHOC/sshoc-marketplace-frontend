import type { Entry } from "@keystatic/core/reader";

import type config from "@/keystatic.config";

export type AboutPage = Entry<(typeof config)["collections"]["about"]>;
export type ContributePage = Entry<(typeof config)["collections"]["contribute"]>;

export type ContactPage = Entry<(typeof config)["singletons"]["contact"]>;
export type HomePage = Entry<(typeof config)["singletons"]["home"]>;
export type PrivacyPolicyPage = Entry<(typeof config)["singletons"]["privacyPolicy"]>;
export type TermsOfUsePage = Entry<(typeof config)["singletons"]["termsOfUse"]>;
