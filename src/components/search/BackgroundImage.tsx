import Image from "next/legacy/image";

import css from "@/components/search/BackgroundImage.module.css";
import Clouds from "~/public/assets/images/backgrounds/search@2x.png";

export function BackgroundImage(): JSX.Element {
	return (
		<div className={css["container"]}>
			<Image src={Clouds} alt="" layout="fill" objectFit="contain" objectPosition="top" priority />
		</div>
	);
}
