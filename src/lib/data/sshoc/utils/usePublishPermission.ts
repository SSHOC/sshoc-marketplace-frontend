import type { UserRole } from "@/lib/data/sshoc/api/user";
import { useCurrentUser } from "@/lib/data/sshoc/hooks/auth";

const allowedRoles: Array<UserRole> = ["administrator", "moderator"];

export function usePublishPermission(): boolean {
  const user = useCurrentUser();

  if (user.data == null) return false;

  if (allowedRoles.includes(user.data.role)) return true;

  return false;
}
