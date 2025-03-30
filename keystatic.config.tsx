import { config } from "@keystatic/core";

import { Logo } from "@/components/logo";
import { env } from "@/config/env.config";
import {
	createAboutPagesCollection,
	createContributePagesCollection,
} from "@/lib/keystatic/collections";
import {
	createMetadataSingleton,
	createNavigationSingleton,
	createPrivacyPolicyPageSingleton,
} from "@/lib/keystatic/singletons";

export default config({
	collections: {
		aboutPages: createAboutPagesCollection(),
		contributePages: createContributePagesCollection(),
	},
	singletons: {
		metadata: createMetadataSingleton(),
		navigation: createNavigationSingleton(),
		privacyPolicyPage: createPrivacyPolicyPageSingleton(),
	},
	storage:
		env.NEXT_PUBLIC_KEYSTATIC_MODE === "github" &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
			? {
					kind: "github",
					repo: {
						owner: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
						name: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
					},
					branchPrefix: "content/",
				}
			: {
					kind: "local",
				},
	ui: {
		brand: {
			mark() {
				return <Logo />;
			},
			name: "SSHOC",
		},
		navigation: {
			Pages: ["aboutPages", "contributePages", "privacyPolicyPage"],
			Settings: ["metadata", "navigation"],
		},
	},
});
