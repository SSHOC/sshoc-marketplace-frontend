import Image from "next/legacy/image";
import type { ReactNode } from "react";

import css from "@/components/account/BackgroundImage.module.css";
import Clouds from "~/public/assets/images/backgrounds/account@2x.png";

export function BackgroundImage(): ReactNode {
	return (
		<div className={css["container"]}>
			<Image src={Clouds} alt="" layout="fill" objectFit="contain" objectPosition="top" priority />
		</div>
	);
}
