import type { FormEvent, ReactNode } from "react";
import { useState } from "react";

import css from "@/components/common/ItemSearchBar.module.css";
import { ItemSearchTermAutocomplete } from "@/components/common/ItemSearchTermAutocomplete";
import { useSearchItems } from "@/components/common/useSearchItems";
import { useSearchFilters } from "@/components/search/useSearchFilters";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { Button } from "@/lib/core/ui/Button/Button";
import { isNonEmptyString } from "@/lib/utils";

export function ItemSearchBar(): ReactNode {
	const searchFilters = useSearchFilters();

	return <ItemSearchForm initialItemSearchTerm={searchFilters.q} key={searchFilters.q} />;
}

interface ItemSearchFormProps {
	initialItemSearchTerm?: string;
}

function ItemSearchForm(props: ItemSearchFormProps): ReactNode {
	const { initialItemSearchTerm } = props;

	const { t } = useI18n<"common">();
	const { searchItems } = useSearchItems();
	const [itemSearchTerm, setItemSearchTerm] = useState(initialItemSearchTerm ?? "");

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		const q = isNonEmptyString(itemSearchTerm) ? itemSearchTerm : undefined;

		searchItems({ q });

		event.preventDefault();
	}

	return (
		<form
			name="item-search"
			noValidate
			role="search"
			method="get"
			action="/search"
			onSubmit={onSubmit}
			aria-label={t(["common", "search", "search-items"])}
			className={css["container"]}
		>
			<ItemSearchTermAutocomplete
				itemSearchTerm={itemSearchTerm}
				onChangeItemSearchTerm={setItemSearchTerm}
				size="sm"
			/>
			<Button color="gradient" size="sm" type="submit">
				{t(["common", "search", "submit-search-term"])}
			</Button>
		</form>
	);
}
