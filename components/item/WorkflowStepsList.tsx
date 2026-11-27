import css from "@/components/item/WorkflowStepsList.module.css";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Button, Disclosure, DisclosurePanel } from "react-aria-components";

import { ItemPreviewMetadata } from "@/components/common/ItemPreviewMetadata";
import { ItemsCount } from "@/components/common/ItemsCount";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ItemDescription } from "@/components/item/ItemDescription";
import { ItemRelatedItems } from "@/components/item/ItemRelatedItems";
import type { Workflow } from "@/data/sshoc/api/workflow";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import TriangleIcon from "@/lib/core/ui/icons/triangle";

export interface WorkflowStepsListProps {
	steps: Workflow["composedOf"];
}

export function WorkflowStepsList(props: WorkflowStepsListProps): ReactNode {
	const { steps } = props;

	const t = useTranslations();

	const category = "step";

	if (steps.length === 0) {
		return null;
	}

	return (
		<section className={css["container"]}>
			<SectionHeader>
				<SectionTitle>
					{t(`common.item-categories.${category}.other`)}
					<ItemsCount count={steps.length} />
				</SectionTitle>
			</SectionHeader>
			<ol role="list" className={css["list"]}>
				{steps.map((step, index) => {
					return (
						<li key={step.persistentId}>
							<WorkflowStep index={index} step={step} />
						</li>
					);
				})}
			</ol>
		</section>
	);
}

interface WorkflowStepProps {
	index: number;
	step: Workflow["composedOf"][number];
}

function WorkflowStep(props: WorkflowStepProps): ReactNode {
	const { index, step } = props;

	const t = useTranslations();

	return (
		<article>
			<Disclosure className={css["item"]}>
				{({ isExpanded }) => (
					<>
						<header className={css["item-header"]}>
							<h3 className={css["item-title"]}>
								<span className={css["item-index"]}>{index + 1}</span> {step.label}
							</h3>
							<Button slot="trigger" className={css["accordion-button"]}>
								{t(`common.item.${isExpanded ? "collapse-workflow-step" : "expand-workflow-step"}`)}
								<Icon icon={TriangleIcon} />
							</Button>
						</header>
						<DisclosurePanel>
							{isExpanded ? (
								<div className={css["item-content"]}>
									<ItemPreviewMetadata item={step} />
									<ItemDescription description={step.description} />
									<ItemRelatedItems items={step.relatedItems} headingLevel={4} />
								</div>
							) : null}
						</DisclosurePanel>
					</>
				)}
			</Disclosure>
		</article>
	);
}
