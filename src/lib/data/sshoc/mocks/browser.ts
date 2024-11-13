import { rest, setupWorker } from "msw";

import { handlers as authHandlers } from "@/lib/data/sshoc/mocks/handlers/auth";
import { handlers as itemHandlers } from "@/lib/data/sshoc/mocks/handlers/item";

export const worker = setupWorker(...authHandlers, ...itemHandlers);

/**
 * @see https://mswjs.io/docs/api/setup-worker/use#examples
 */
window.msw = { worker, rest };

declare global {
  interface Window {
    msw: {
      worker: typeof worker;
      rest: typeof rest;
    };
  }
}
