import { useTranslations } from "next-intl";
import type { Key, ReactNode } from "react";
import { useMemo } from "react";

import { useSearchItems } from "@/components/common/useSearchItems";
import { debounceDelay } from "@/config/sshoc.config";
import type { ItemCategory, ItemSearchSuggestion } from "@/data/sshoc/api/item";
import { useItemAutocomplete } from "@/data/sshoc/hooks/item";
import { Item } from "@/lib/core/ui/Collection/Item";
import { HighlightedText } from "@/lib/core/ui/HighlightedText/HighlightedText";
import { SearchAutocomplete } from "@/lib/core/ui/SearchAutocomplete/SearchAutocomplete";
import { mapBy } from "@/lib/utils";
import { useDebouncedState } from "@/lib/utils/hooks/useDebouncedState";

export interface ItemSearchAutocompleteProps {
	itemCategory?: ItemCategory;
	itemSearchTerm: string;
	onChangeItemSearchTerm: (itemSearchTerm: string) => void;
	onSubmit?: () => void;
	/** @default 'md' */
	size?: "md" | "sm";
}

export function ItemSearchTermAutocomplete(props: ItemSearchAutocompleteProps): ReactNode {
	const { itemCategory, itemSearchTerm, onChangeItemSearchTerm, onSubmit, size } = props;

	const t = useTranslations();
	const { searchItems } = useSearchItems();
	const debouncedItemSearchTerm = useDebouncedState({
		value: itemSearchTerm,
		delay: debounceDelay,
	}).trim();
	const itemAutocompleteSuggestions = useItemAutocomplete({
		q: debouncedItemSearchTerm,
		category: itemCategory,
	});
	const itemsById = useMemo(() => {
		if (itemAutocompleteSuggestions.data?.suggestions == null) {
			return new Map<string, ItemSearchSuggestion>();
		}
		return mapBy(itemAutocompleteSuggestions.data.suggestions, "persistentId");
	}, [itemAutocompleteSuggestions.data]);
	const items =
		itemSearchTerm.length > 0 ? (itemAutocompleteSuggestions.data?.suggestions ?? []) : [];

	function onSelectSuggestion(value: string | null, key: Key | null) {
		const item = itemsById.get(key as string);
		const q = item?.phrase ?? value ?? undefined;
		const categories = itemCategory != null ? [itemCategory] : undefined;
		searchItems({ q, categories });
		onSubmit?.();
	}

	return (
		<SearchAutocomplete
			name="q"
			aria-label={t("common.home.search.item-search-term")}
			items={items}
			loadingState={itemAutocompleteSuggestions.isLoading ? "loading" : "idle"}
			inputValue={itemSearchTerm}
			onInputChange={onChangeItemSearchTerm}
			onSubmit={onSelectSuggestion}
			size={size}
		>
			{(item) => {
				return (
					<Item key={item.persistentId} textValue={item.phrase}>
						<HighlightedText text={item.phrase} searchPhrase={itemSearchTerm} />
					</Item>
				);
			}}
		</SearchAutocomplete>
	);
}
