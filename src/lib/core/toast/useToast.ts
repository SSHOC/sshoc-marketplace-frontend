import { toast } from "react-toastify";

export function useToast(): typeof toast {
	return toast;
}
