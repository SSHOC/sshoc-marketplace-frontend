import { useRoute } from "@/lib/core/navigation/useRoute";

export function usePathname(): string {
	const route = useRoute();

	return route.pathname;
}
