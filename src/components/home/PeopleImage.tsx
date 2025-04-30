import Image from "next/image";
import type { ReactNode } from "react";

import css from "@/components/home/PeopleImage.module.css";
import People from "~/public/assets/images/backgrounds/home-people.svg";

export function PeopleImage(): ReactNode {
	return (
		<div className={css["container"]}>
			<Image
				src={People}
				alt=""
				fill
				sizes="100vw"
				style={{
					objectFit: "contain",
					objectPosition: "bottom",
				}}
			/>
		</div>
	);
}
