import { useButton } from "@react-aria/button";
import { useTranslations } from "next-intl";
import { Fragment, type ReactNode, useRef } from "react";

import { ItemPreviewMetadata } from "@/components/common/ItemPreviewMetadata";
import { ItemsCount } from "@/components/common/ItemsCount";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ItemDescription } from "@/components/item/ItemDescription";
import { ItemRelatedItems } from "@/components/item/ItemRelatedItems";
import css from "@/components/item/WorkflowStepsList.module.css";
import type { Workflow } from "@/data/sshoc/api/workflow";
import { useDisclosure } from "@/lib/core/ui/hooks/useDisclosure";
import { useDisclosureState } from "@/lib/core/ui/hooks/useDisclosureState";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import TriangleIcon from "@/lib/core/ui/icons/triangle.svg?symbol-icon";
import { isPropertyConcept } from "@/data/sshoc/api/property";
import { maxPreviewMetadataValues } from "@/config/sshoc.config";

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

	// TODO: Convert to Accordion, once https://github.com/adobe/react-spectrum/issues/1989 is resolved.
	const state = useDisclosureState({});
	const { contentProps, triggerProps } = useDisclosure(state);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const { buttonProps } = useButton(
		{
			...(triggerProps as any),
			onPress() {
				state.toggle();
			},
		},
		buttonRef,
	);

	return (
		<article className={css["item"]}>
			<header className={css["item-header"]}>
				<h3 className={css["item-title"]}>
					<span className={css["item-index"]}>{index + 1}</span> {step.label}
				</h3>
				<button
					type="button"
					{...buttonProps}
					className={css["accordion-button"]}
					data-state={state.isOpen ? "expanded" : "collapsed"}
					ref={buttonRef}
				>
					{t(`common.item.${state.isOpen ? "collapse-workflow-step" : "expand-workflow-step"}`)}
					<Icon icon={TriangleIcon} />
				</button>
			</header>
			{state.isOpen ? (
				<div {...contentProps} className={css["item-content"]}>
					<ItemPreviewMetadata item={step}>
						<StepMetadata step={step} />
					</ItemPreviewMetadata>
					<ItemDescription description={step.description} />
					<ItemRelatedItems items={step.relatedItems} headingLevel={4} />
				</div>
			) : null}
		</article>
	);
}

interface StepMetadataProps {
	step: Workflow["composedOf"][number];
}

function StepMetadata(props: StepMetadataProps): ReactNode {
	const { step } = props;

	const t = useTranslations();

	const conceptBasedProperties = step.properties.filter(isPropertyConcept);

	const outputformat = conceptBasedProperties
		.filter((property) => {
			return property.type.code === "outputformat";
		})
		.slice(0, maxPreviewMetadataValues);

	const inputformat = conceptBasedProperties
		.filter((property) => {
			return property.type.code === "inputformat";
		})
		.slice(0, maxPreviewMetadataValues);

	return (
		<Fragment>
			{inputformat.length > 0 ? (
				<Fragment>
					<dt>{t("common.item.inputformat.other")}</dt>
					<dd>
						<ul role="list" className={css["metadata-terms"]}>
							{inputformat.map((property) => {
								return (
									<li key={property.concept.code}>
										<span>{property.concept.label}</span>
									</li>
								);
							})}
						</ul>
					</dd>
				</Fragment>
			) : null}

			{outputformat.length > 0 ? (
				<Fragment>
					<dt>{t("common.item.outputformat.other")}</dt>
					<dd>
						<ul role="list" className={css["metadata-terms"]}>
							{outputformat.map((property) => {
								return (
									<li key={property.concept.code}>
										<span>{property.concept.label}</span>
									</li>
								);
							})}
						</ul>
					</dd>
				</Fragment>
			) : null}
		</Fragment>
	);
}
