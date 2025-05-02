import { Fragment, type ReactNode } from "react";

import type { PropertyType } from "@/data/sshoc/api/property";
import { Link } from "@/lib/core/ui/Link/Link";
import _propertyTypes from "@/public/data/property-types.json";

const propertyTypes = _propertyTypes as Record<PropertyType["code"], PropertyType>;

export function SeeVocabularyLink({ type }: { type: string }): ReactNode {
	return (
		<Fragment>
			{propertyTypes[type]!.allowedVocabularies.map((vocabulary, index) => {
				const href = vocabulary.accessibleAt ?? vocabulary.namespace;

				if (href == null) return null;

				return (
					<Fragment key={vocabulary.code}>
						{index !== 0 ? ", " : null}
						<Link href={href} target="_blank" rel="noreferrer">
							{vocabulary.label}
						</Link>
					</Fragment>
				);
			})}
		</Fragment>
	);
}
