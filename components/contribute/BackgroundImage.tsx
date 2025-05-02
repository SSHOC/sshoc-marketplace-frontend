import Image from "next/image";
import type { ReactNode } from "react";

import css from "@/components/contribute/BackgroundImage.module.css";
import Clouds from "@/public/assets/images/backgrounds/contribute@2x.png";

export function BackgroundImage(): ReactNode {
	return (
		<div className={css["container"]}>
			<Image
				src={Clouds}
				alt=""
				priority
				fill
				sizes="100vw"
				style={{
					objectFit: "contain",
					objectPosition: "top",
				}}
			/>
		</div>
	);
}
