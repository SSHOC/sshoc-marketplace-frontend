import { setupServer } from "msw/node";

import { handlers as authHandlers } from "@/data/sshoc/mocks/handlers/auth";
import { handlers as itemHandlers } from "@/data/sshoc/mocks/handlers/item";

export const server = setupServer(...authHandlers, ...itemHandlers);
