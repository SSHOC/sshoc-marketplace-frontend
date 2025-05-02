import Image from "next/image";
import type { ReactNode } from "react";

import css from "@/components/auth/BackgroundImage.module.css";
import Clouds from "@/public/assets/images/backgrounds/sign-in@2x.png";

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
					objectPosition: "right bottom",
				}}
			/>
		</div>
	);
}
