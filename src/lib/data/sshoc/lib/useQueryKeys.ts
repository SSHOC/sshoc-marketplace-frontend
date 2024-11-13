import type { AuthData } from "@/lib/data/sshoc/api/common";
import type { createQueryKey } from "@/lib/data/sshoc/lib/createQueryKey";
import { useSession } from "@/lib/data/sshoc/lib/useSession";

export function useQueryKeys<T>(keys: T, auth?: AuthData): T {
  const session = useSession(auth);

  const queryKeys = addAuthData(keys, session);

  return queryKeys;
}

function addAuthData<T>(keys: T, session: AuthData): T {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const queryKeys = {} as any;

  Object.entries(keys).forEach(([key, value]) => {
    if (typeof value === "function") {
      const createQueryKeyWithAuth: typeof createQueryKey =
        function createQueryKeyWithAuth(scope, kind, params) {
          return value(scope, kind, params, session);
        };
      queryKeys[key] = createQueryKeyWithAuth;
    } else {
      queryKeys[key] = addAuthData(value, session);
    }
  });

  return queryKeys;
}
