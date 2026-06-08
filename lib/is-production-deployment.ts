import { env } from "@/config/env.config";

export const isProductionDeployment =
	env.NEXT_PUBLIC_APP_BASE_URL === "https://marketplace.sshopencloud.eu";
