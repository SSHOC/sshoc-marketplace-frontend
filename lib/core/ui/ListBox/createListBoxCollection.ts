import { ListCollection } from "@react-stately/list";
import type { Collection, Node } from "@react-types/shared";

/** Virtualizer 4 expects loading/empty rows in its collection, rather than layout flags. */
export function createListBoxCollection<T>(
	collection: Collection<Node<T>>,
	isLoading: boolean,
): Collection<Node<T>> {
	const nodes = Array.from(collection);
	if (!isLoading && collection.size > 0 && !nodes.some((node) => node.type === "section"))
		return collection;
	// ListCollection links its nodes. Clone them so status rows never enter the selection collection.
	const clone = (node: Node<T>): Node<T> => {
		const children = Array.from(node.childNodes, clone);
		// Legacy useListState sections store headings on the section itself. Layout 4
		// expects explicit header nodes, as produced by React Aria Components.
		if (node.type === "section")
			children.unshift({
				...node,
				type: "header",
				key: `__listbox_header__${node.key}`,
				parentKey: node.key,
				hasChildNodes: false,
				childNodes: [],
			});
		return { ...node, childNodes: children };
	};
	const status: Node<T> = {
		type: "loader",
		key: "__listbox_status__",
		value: null,
		level: 0,
		index: collection.size,
		hasChildNodes: false,
		childNodes: [],
		rendered: null,
		textValue: "",
		// Reserve the status row for either the loading indicator or the empty message.
		props: { isLoading: true },
	};
	const normalized = nodes.map(clone);
	if (isLoading || collection.size === 0) normalized.push(status);
	return new ListCollection(normalized);
}
