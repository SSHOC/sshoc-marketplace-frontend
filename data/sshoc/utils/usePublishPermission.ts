import type { UserRole } from "@/data/sshoc/api/user";
import { useCurrentUser } from "@/data/sshoc/hooks/auth";

const allowedRoles: Array<UserRole> = ["administrator", "moderator"];

export function usePublishPermission(): boolean {
	const user = useCurrentUser();

	if (user.data == null) {
		return false;
	}

	if (allowedRoles.includes(user.data.role)) {
		return true;
	}

	return false;
}
