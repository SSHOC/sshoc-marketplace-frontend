import { env } from "@/config/env.config";

export const isProductionDeployment =
	env.NEXT_PUBLIC_API_BASE_URL === "https://marketplace.sshopencloud.eu";
