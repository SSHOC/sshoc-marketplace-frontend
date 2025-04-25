import { VisuallyHidden } from "@react-aria/visually-hidden";
import type { ReactNode } from "react";
import { useMemo } from "react";

import { Timestamp } from "@/components/common/Timestamp";
import css from "@/components/item/ItemMetadata.module.css";
import type { Item } from "@/data/sshoc/api/item";
import type { Property } from "@/data/sshoc/api/property";
import { isPropertyConcept } from "@/data/sshoc/api/property";
import { usePublishPermission } from "@/data/sshoc/utils/usePublishPermission";
import { useI18n } from "@/lib/core/i18n/useI18n";

export interface ItemPropertiesProps {
	properties: Item["properties"];
}

export function ItemProperties(props: ItemPropertiesProps): ReactNode {
	const { properties } = props;

	const { t } = useI18n<"common">();
	const groups = useGroupedPropertyValues({ properties });

	if (groups.length === 0) {
		return null;
	}

	return (
		<div>
			<dt>
				<VisuallyHidden>{t(["common", "item", "properties", "other"])}</VisuallyHidden>
			</dt>
			<dd>
				<dl className={css["groups"]}>
					{groups.map(([groupName, group]) => {
						return (
							<div key={groupName} className={css["group"]}>
								<dt className={css["group-label"]}>{groupName}</dt>
								<dd>
									<dl className={css["group-items"]}>
										{group.map(([label, values]) => {
											return (
												<div key={label} className={css["value-group"]}>
													<dt className={css["value-group-label"]}>{label}</dt>
													<dd>
														<ul role="list" className={css["value-group-items"]}>
															{values.map((value, index) => {
																return <li key={index}>{value}</li>;
															})}
														</ul>
													</dd>
												</div>
											);
										})}
									</dl>
								</dd>
							</div>
						);
					})}
				</dl>
			</dd>
		</div>
	);
}

interface UseGroupedPropertyValuesArgs {
	properties: Item["properties"];
}

function useGroupedPropertyValues(
	args: UseGroupedPropertyValuesArgs,
): Array<[string, Array<[string, Array<ReactNode>]>]> {
	const { properties } = args;

	const { createCollator } = useI18n<"common">();
	const hasPermission = usePublishPermission();

	const groups = useMemo(() => {
		const compare = createCollator();

		const groups = new Map<string, Map<string, Array<Property>>>();

		properties.forEach((property) => {
			/** Hidden properties should only be visible for admins and moderators. */
			if (property.type.hidden && !hasPermission) {
				return;
			}

			/** Not translated since property labels returned from backend are not translated either. */
			const groupName = property.type.groupName ?? "Other";
			const label = property.type.label;

			if (!groups.has(groupName)) {
				groups.set(groupName, new Map());
			}

			const group = groups.get(groupName)!;

			if (!group.has(label)) {
				group.set(label, []);
			}

			const properties = group.get(label)!;

			properties.push(property);
		});

		const sortedGroups = Array.from(groups).sort(([groupName], [otherGroupName]) => {
			return compare(groupName, otherGroupName);
		});

		const sorted = sortedGroups.map(([groupName, group]) => {
			return [
				groupName,
				Array.from(group)
					.sort(([_label, properties], [_otherLabel, otherProperties]) => {
						return properties[0]!.type.ord > otherProperties[0]!.type.ord ? 1 : -1;
					})
					.map(([label, properties]) => {
						return [
							label,
							properties.map((property) => {
								return getPropertyValue(property);
							}),
						];
					}),
			];
		});

		return sorted;
	}, [properties, createCollator, hasPermission]);

	return groups as Array<[string, Array<[string, Array<ReactNode>]>]>;
}

function getPropertyValue(property: Property) {
	if (isPropertyConcept(property)) {
		return (
			<a href={property.concept.uri} target="_blank" rel="noreferrer" className={css["link"]}>
				{property.concept.label}
			</a>
		);
	}

	const value = property.value;

	switch (property.type.type) {
		case "date":
			return <Timestamp dateTime={value} />;
		case "url":
			return (
				<a href={value} target="_blank" rel="noreferrer" className={css["link"]}>
					{value}
				</a>
			);
		case "boolean":
		case "float":
		case "int":
		case "string":
		default:
			return String(value);
	}
}
