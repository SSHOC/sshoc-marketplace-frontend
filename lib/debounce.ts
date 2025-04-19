type AsyncFunction<T> = () => Promise<T>;

export function debounce<T>(
	fn: AsyncFunction<T>,
	wait: number,
): {
	call: () => Promise<T>;
	isPending: () => boolean;
	cancel: () => void;
} {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	let pending = false;
	let rejectCurrent: ((reason?: any) => void) | null = null;

	const call = (): Promise<T> => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}

		// If there's already a pending call, reject it
		if (rejectCurrent) {
			rejectCurrent(new Error("Debounced call canceled"));
			rejectCurrent = null;
		}

		pending = true;

		return new Promise<T>((resolve, reject) => {
			rejectCurrent = reject;

			timeoutId = setTimeout(async () => {
				timeoutId = null;
				try {
					const result = await fn();
					resolve(result);
				} catch (err) {
					reject(err);
				} finally {
					pending = false;
					rejectCurrent = null;
				}
			}, wait);
		});
	};

	const cancel = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
		if (rejectCurrent) {
			rejectCurrent(new Error("Debounced call canceled"));
			rejectCurrent = null;
		}
		pending = false;
	};

	return {
		call,
		isPending: () => {
			return pending;
		},
		cancel,
	};
}
