import Image from "next/image";
import type { ReactNode } from "react";

import People from "@/public/assets/images/backgrounds/home-people.svg";

export function PeopleImage(): ReactNode {
	return (
		<div className="relative -z-1 col-[1/-1] [grid-row:hero] mb-8 self-stretch xs:col-[3/-3]">
			<Image src={People} alt="" fill sizes="100vw" className="object-contain object-bottom" />
		</div>
	);
}
