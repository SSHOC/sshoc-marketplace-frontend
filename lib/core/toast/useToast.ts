import { toast } from "react-toastify/unstyled";

export function useToast(): typeof toast {
	return toast;
}
