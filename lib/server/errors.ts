export class ForbiddenError extends Error {
	name = "ForbiddenError" as const;
}

export function isForbiddenError(error: unknown): error is ForbiddenError {
	return error instanceof ForbiddenError;
}

export class HoneypotError extends Error {
	name = "HoneypotError" as const;
}

export function isHoneypotError(error: unknown): error is HoneypotError {
	return error instanceof HoneypotError;
}

export class RateLimitError extends Error {
	name = "RateLimitError" as const;
}

export function isRateLimitError(error: unknown): error is RateLimitError {
	return error instanceof RateLimitError;
}

export class UnauthorizedError extends Error {
	name = "UnauthorizedError" as const;
}

export function isUnauthorizedError(error: unknown): error is UnauthorizedError {
	return error instanceof UnauthorizedError;
}
