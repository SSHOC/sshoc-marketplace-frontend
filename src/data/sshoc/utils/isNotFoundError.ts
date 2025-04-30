import { HttpError } from "@stefanprobst/request";

export function isNotFoundError(error: unknown): boolean {
	return error instanceof HttpError && error.response.status === 404;
}
