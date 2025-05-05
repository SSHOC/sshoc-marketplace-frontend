import { env } from "@/config/env.config";

export const baseUrl = env.NEXT_PUBLIC_APP_BASE_URL;

export const webManifest = "site.webmanifest";

export const openGraphImageName = "open-graph.webp";

export const toastAutoCloseDelay = 7500;

export const googleSiteId = env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
