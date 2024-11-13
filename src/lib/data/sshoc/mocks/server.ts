import { setupServer } from "msw/node";

import { handlers as authHandlers } from "@/lib/data/sshoc/mocks/handlers/auth";
import { handlers as itemHandlers } from "@/lib/data/sshoc/mocks/handlers/item";

export const server = setupServer(...authHandlers, ...itemHandlers);
