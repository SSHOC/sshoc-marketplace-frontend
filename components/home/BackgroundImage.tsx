import Image from "next/image";
import type { ReactNode } from "react";

import Clouds from "@/public/assets/images/backgrounds/home@2x.png";

export function BackgroundImage(): ReactNode {
	return (
		<div className="relative -z-1 col-[2/-2] row-[1/-2] -mx-8 max-w-none self-stretch">
			<Image
				src={Clouds}
				alt=""
				priority
				fill
				sizes="100vw"
				className="object-contain object-top"
			/>
		</div>
	);
}
