import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { FormRecordEditButton } from "@/components/common/FormRecordEditButton";
import { FormRecordRemoveButton } from "@/components/common/FormRecordRemoveButton";
import { SearchResult } from "@/components/common/SearchResult";
import { SearchResultControls } from "@/components/common/SearchResultControls";
import { SearchResultTitle } from "@/components/common/SearchResultTitle";
import type { WorkflowStepInput } from "@/data/sshoc/api/workflow-step";
import { useFieldState } from "@/lib/core/form/useFieldState";
import { ButtonLink } from "@/lib/core/ui/Button/ButtonLink";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import TriangleIcon from "@/lib/core/ui/icons/triangle.svg?symbol-icon";

export interface WorkflowStepPreviewProps {
	name: string;
	index: number;
	onEdit: () => void;
	onRemove: () => void;
	onMoveUp: () => void;
	onMoveDown: () => void;
	isFirst: boolean;
	isLast: boolean;
}

export function WorkflowStepPreview(props: WorkflowStepPreviewProps): ReactNode {
	const { name, index, onEdit, onRemove, onMoveUp, onMoveDown, isFirst, isLast } = props;

	const t = useTranslations();
	const step = useFieldState<WorkflowStepInput>(name).input.value;
	const position = String(index + 1);

	return (
		<SearchResult>
			<SearchResultTitle>{step.label}</SearchResultTitle>
			<SearchResultControls>
				{!isFirst ? (
					<ButtonLink onPress={onMoveUp}>
						<Icon icon={TriangleIcon} rotation="half" />
						{t("authenticated.controls.move-up")}
					</ButtonLink>
				) : null}
				{!isLast ? (
					<ButtonLink onPress={onMoveDown}>
						<Icon icon={TriangleIcon} />
						{t("authenticated.controls.move-down")}
					</ButtonLink>
				) : null}
				<FormRecordEditButton
					aria-label={t("authenticated.forms.edit-workflow-step", { position })}
					onPress={onEdit}
				>
					{t("authenticated.controls.edit")}
				</FormRecordEditButton>
				<FormRecordRemoveButton
					aria-label={t("authenticated.forms.remove-workflow-step", {
						position,
					})}
					onPress={onRemove}
				>
					{t("authenticated.controls.delete")}
				</FormRecordRemoveButton>
			</SearchResultControls>
		</SearchResult>
	);
}
