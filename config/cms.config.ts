export { baseUrl as siteUrl } from "~/config/site.config";

export const useLocalBackend = process.env.NEXT_PUBLIC_LOCAL_CMS_BACKEND === "enabled";

const repo = process.env.NEXT_PUBLIC_GITHUB_REPOSITORY ?? "sshoc/sshoc-marketplace-frontend";
const branch = process.env.NEXT_PUBLIC_GITHUB_REPOSITORY_BRANCH ?? "main";
const apiBaseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL ?? "https://marketplace.sshopencloud.eu";

export const backend = {
	provider: "github" as const,
	repo,
	branch,
	isPublic: true,
	auth: {
		apiBaseUrl,
		endpoint: "/api/oauth/authorize",
	},
	squash_merges: true,
};

export const logo = "/assets/images/logo-with-text.svg";
