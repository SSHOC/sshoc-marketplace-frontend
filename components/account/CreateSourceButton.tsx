import { useTranslations } from "next-intl";
import { Fragment, type ReactNode, useState } from "react";
import { DialogTrigger } from "react-aria-components";

import type { SourceFormValues } from "@/components/account/SourceForm";
import { SourceForm } from "@/components/account/SourceForm";
import { useCreateSource } from "@/data/sshoc/hooks/source";
import type { MutationMetadata } from "@/lib/core/query/types";
import { Button } from "@/lib/core/ui/Button/Button";
import { ButtonLink } from "@/lib/core/ui/Button/ButtonLink";
import { ModalDialog } from "@/lib/core/ui/ModalDialog/ModalDialog";

export interface CreateSourceButtonProps {
	/** @default 'button' */
	variant?: "button-link" | "button";
}

export function CreateSourceButton(props: CreateSourceButtonProps): ReactNode {
	const { variant = "button" } = props;

	const [isOpen, setOpen] = useState(false);
	const t = useTranslations();
	const meta: MutationMetadata = {
		messages: {
			mutate() {
				return t("authenticated.sources.create-source-pending");
			},
			success() {
				return t("authenticated.sources.create-source-success");
			},
			error() {
				return t("authenticated.sources.create-source-error");
			},
		},
	};
	const createSource = useCreateSource(undefined, { meta });

	function onCreateSource(values: SourceFormValues) {
		setOpen(false);
		createSource.mutate({ data: values });
	}

	function onCloseDialog() {
		setOpen(false);
	}

	return (
		<Fragment>
			<DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
				{variant === "button-link" ? (
					<ButtonLink>{t("authenticated.sources.create-source")}</ButtonLink>
				) : (
					<Button color="gradient">{t("authenticated.sources.create-source")}</Button>
				)}
				<ModalDialog
					isDismissable
					onClose={onCloseDialog}
					title={t("authenticated.sources.create-source")}
				>
					<SourceForm name="create-source" onCancel={onCloseDialog} onSubmit={onCreateSource} />
				</ModalDialog>
			</DialogTrigger>
		</Fragment>
	);
}
