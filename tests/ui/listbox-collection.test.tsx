import { ListCollection, useListState } from "@react-stately/list";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Item } from "@/lib/core/ui/Collection/Item";
import { Section } from "@/lib/core/ui/Collection/Section";
import { createListBoxCollection } from "@/lib/core/ui/ListBox/createListBoxCollection";

describe("virtualized list status rows", () => {
	it("keeps loading rows out of selection navigation and preserves existing nodes", () => {
		const { result } = renderHook(() =>
			useListState({
				children: [<Item key="first">First</Item>, <Item key="last">Last</Item>],
				selectionMode: "single",
			}),
		);
		const original = result.current.collection;
		const loading = createListBoxCollection(original, true);
		expect([...loading].map((node) => node.type)).toEqual(["item", "item", "loader"]);
		expect(original.getKeyAfter("last")).toBeNull();
		expect(original.getLastKey()).toBe("last");
		expect(loading.getItem("last")).not.toBe(original.getItem("last"));
		expect(createListBoxCollection(original, false)).toBe(original);
	});

	it("preserves section headings without making them selectable", () => {
		const { result } = renderHook(() =>
			useListState({
				children: [
					<Section key="group" title="Heading">
						<Item key="item">Item</Item>
					</Section>,
				],
				selectionMode: "single",
			}),
		);
		const original = result.current.collection;
		const normalized = createListBoxCollection(original, false);
		expect(Array.from(normalized.getItem("group")!.childNodes).map((node) => node.type)).toEqual([
			"header",
			"item",
		]);
		expect(Array.from(original.getItem("group")!.childNodes).map((node) => node.type)).toEqual([
			"item",
		]);
		expect(original.getKeyBefore("item")).toBe("group");
	});

	it("reserves space for the empty state without adding a selectable option", () => {
		const empty = new ListCollection<object>([]);
		const collection = createListBoxCollection(empty, false);
		expect(collection.size).toBe(0);
		expect([...collection]).toHaveLength(1);
		expect([...collection][0]).toMatchObject({ type: "loader", props: { isLoading: true } });
		expect(empty.getFirstKey()).toBeNull();
	});
});
