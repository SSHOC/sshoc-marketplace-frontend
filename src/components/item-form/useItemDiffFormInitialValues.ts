import { useMemo } from "react";

import type { Item, ItemsDiff } from "@/data/sshoc/api/item";

export interface UseItemDiffFormInitialValues<T extends Item> {
	diff: ItemsDiff | undefined;
	item: T | undefined;
}

export function useItemDiffFormInitialValues<T extends Item>(
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
			/* @ts-expect-error Not worth fixing types here. */
			if (Array.isArray(value) && value.length > initialValues[key].length) {
				switch (key) {
					case "accessibleAt":
						initialValues[key] = initialValues[key].concat(
							Array(value.length - initialValues[key].length).fill(undefined),
						);
						break;
					case "externalIds":
						initialValues[key] = initialValues[key].concat(
							Array(value.length - initialValues[key].length).fill({
								identifier: undefined,
								identifierService: { code: undefined },
							}),
						);
						break;
					case "contributors":
						initialValues[key] = initialValues[key].concat(
							Array(value.length - initialValues[key].length).fill({
								role: { code: undefined },
								actor: { id: undefined },
							}),
						);
						break;
					case "properties":
						initialValues[key] = initialValues[key].concat(
							Array(value.length - initialValues[key].length).fill({
								type: { code: undefined, type: undefined },
								// value: undefined,
								concept: { uri: undefined },
							}),
						);
						break;
					case "relatedItems":
						initialValues[key] = initialValues[key].concat(
							Array(value.length - initialValues[key].length).fill({
								relation: { code: undefined },
								persistentId: undefined,
							}),
						);
						break;
					case "media":
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
