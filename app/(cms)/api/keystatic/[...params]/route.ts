import { makeRouteHandler } from "@keystatic/next/route-handler";

import config from "@/config/keystatic.config";

export const { POST, GET } = makeRouteHandler({ config });
