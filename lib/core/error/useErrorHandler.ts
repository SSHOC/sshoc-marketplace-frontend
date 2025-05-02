import { useState } from "react";

/**
 * Error boundaries can only handle errors thrown during React lifecycles. For errors thrown in event
 * handlers to be handled by an error boundary, the error must be catched and re-thrown via this hook.
 *
 * @see https://blitzjs.com/docs/error-boundary#use-error-handler
 */
export function useErrorHandler(givenError?: unknown): (error: unknown) => void {
	const [error, setError] = useState<unknown>(null);
	if (givenError != null) {
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw givenError;
	}
	if (error != null) {
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw error;
	}
	return setError;
}
