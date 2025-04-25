import Image from "next/legacy/image";

import css from "@/components/about/BackgroundImage.module.css";
import Clouds from "~/public/assets/images/backgrounds/about@2x.png";

export function BackgroundImage(): JSX.Element {
	return (
		<div className={css["container"]}>
			<Image src={Clouds} alt="" layout="fill" objectFit="contain" objectPosition="top" priority />
		</div>
	);
}
