import Link from "next/link";
import type { ReactNode } from "react";

import css from "@/components/item-form/FormHelpText.module.css";

export function FormHelpText(): ReactNode {
	return (
		<p className={css["text"]}>
			If you need more details on metadata fields, please consult{" "}
			<Link href="/contribute/metadata-guidelines#guidance-for-metadata-fields">
				our guidelines
			</Link>
			, or <Link href="/contact">contact the Editorial Team</Link>!
		</p>
	);
}
