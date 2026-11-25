import { useMemo } from "react";

import type { ItemInput, ItemsDiff } from "@/data/sshoc/api/item";

export interface UseItemDiffFormInitialValues<T extends Partial<ItemInput>> {
	diff: ItemsDiff | undefined;
	item: T | undefined;
}

export function useItemDiffFormInitialValues<T extends Partial<ItemInput>>(
	args: UseItemDiffFormInitialValues<T>,
): T | undefined {
	const { diff, item } = args;

	const initialValues = useMemo(() => {
		if (diff == null || item == null || diff.equal) {
			return item;
		}

		const initialValues = { ...item };

		/**
		 * Add deleted array field items to initial form values, so we can attach
		 * diff metadata to them in `useDiffFormFieldMetadata`.
		 */
		Object.entries(diff.item).forEach(([key, value]) => {
			if (Array.isArray(value) && key in initialValues) {
				switch (key) {
					case "accessibleAt":
						if (initialValues[key] == null || value.length <= initialValues[key].length) break;
						initialValues[key] = initialValues[key].concat(
							Array(value.length - initialValues[key].length).fill(undefined),
						);
						break;
					case "externalIds":
						if (initialValues[key] == null || value.length <= initialValues[key].length) break;
						initialValues[key] = initialValues[key].concat(
							Array(value.length - initialValues[key].length).fill({
								identifier: undefined,
								identifierService: { code: undefined },
							}),
						);
						break;
					case "contributors":
						if (initialValues[key] == null || value.length <= initialValues[key].length) break;
						initialValues[key] = initialValues[key].concat(
							Array(value.length - initialValues[key].length).fill({
								role: { code: undefined },
								actor: { id: undefined },
							}),
						);
						break;
					case "properties":
						if (initialValues[key] == null || value.length <= initialValues[key].length) break;
						initialValues[key] = initialValues[key].concat(
							Array(value.length - initialValues[key].length).fill({
								type: { code: undefined, type: undefined },
								// value: undefined,
								concept: { uri: undefined },
							}),
						);
						break;
					case "relatedItems":
						if (initialValues[key] == null || value.length <= initialValues[key].length) break;
						initialValues[key] = initialValues[key].concat(
							Array(value.length - initialValues[key].length).fill({
								relation: { code: undefined },
								persistentId: undefined,
							}),
						);
						break;
					case "media":
						if (initialValues[key] == null || value.length <= initialValues[key].length) break;
						initialValues[key] = initialValues[key].concat(
							Array(value.length - initialValues[key].length).fill(undefined),
						);
						break;
				}
			}
		});

		return initialValues;
	}, [diff, item]);

	return initialValues;
}
