import css from "@/components/common/ItemSearchDialog.module.css";
import buttonCss from "@/lib/core/ui/Button/Button.module.css";

import { useTranslations } from "next-intl";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { Button as AriaButton, DialogTrigger, Heading } from "react-aria-components";

import { ItemSearchTermAutocomplete } from "@/components/common/ItemSearchTermAutocomplete";
import { useSearchItems } from "@/components/common/useSearchItems";
import { ModalDialog } from "@/components/search/ModalDialog";
import { useSearchFilters } from "@/components/search/useSearchFilters";
import { Button } from "@/lib/core/ui/Button/Button";
import { CloseButton } from "@/lib/core/ui/CloseButton/CloseButton";
import { isNonEmptyString } from "@/lib/utils";

export function ItemSearchDialog(): ReactNode {
	const t = useTranslations();
	const searchFilters = useSearchFilters();
	return (
		<DialogTrigger>
			<AriaButton
				className={buttonCss["button"]}
				data-color="gradient"
				data-size="md"
				data-variant="fill"
				data-dialog="search-term"
			>
				{t("common.search.open-search-dialog")}
			</AriaButton>
			<ModalDialog isDismissable>
				{({ close }) => (
					<>
						<header className={css["dialog-header"]}>
							<Heading slot="title" level={2} className={css["dialog-title"]}>
								{t("common.search.search-items")}
							</Heading>
							<CloseButton
								aria-label={t("common.search.close-search-dialog")}
								autoFocus
								onPress={close}
								size="lg"
							/>
						</header>
						<ItemSearchForm
							key={searchFilters.q}
							initialItemSearchTerm={searchFilters.q}
							onClose={close}
						/>
					</>
				)}
			</ModalDialog>
		</DialogTrigger>
	);
}

interface ItemSearchFormProps {
	initialItemSearchTerm?: string;
	onClose?: () => void;
}

function ItemSearchForm(props: ItemSearchFormProps): ReactNode {
	const { initialItemSearchTerm, onClose } = props;

	const t = useTranslations();
	const { searchItems } = useSearchItems();
	const [itemSearchTerm, setItemSearchTerm] = useState(initialItemSearchTerm ?? "");

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		const q = isNonEmptyString(itemSearchTerm) ? itemSearchTerm : undefined;

		searchItems({ q });

		onClose?.();

		event.preventDefault();
	}

	return (
		<form
			noValidate
			role="search"
			method="get"
			action="/search"
			onSubmit={onSubmit}
			aria-label={t("common.search.search-items")}
			className={css["form-container"]}
		>
			<ItemSearchTermAutocomplete
				itemSearchTerm={itemSearchTerm}
				onChangeItemSearchTerm={setItemSearchTerm}
				onSubmit={onClose}
			/>
			<Button type="submit" color="gradient">
				{t("common.search.submit-search-term")}
			</Button>
		</form>
	);
}
