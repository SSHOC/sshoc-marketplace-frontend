import type { ReactNode } from "react";
import { Fragment, useEffect, useState } from "react";

export interface MdxProps {
	mdx: string;
}

export function Mdx(props: MdxProps): ReactNode {
	const { mdx } = props;

	const [element, setElement] = useState<ReactNode>(null);

	useEffect(() => {
		let isCanceled = false;

		async function run() {
			const { createProcessor } = await import("@/lib/cms/components/create-processor");

			const processor = await createProcessor();
			const vfile = await processor.process(mdx);

			if (!isCanceled) {
				setElement(vfile.result);
			}
		}

		run();

		return () => {
			isCanceled = true;
		};
	}, [mdx]);

	// eslint-disable-next-line react/jsx-no-useless-fragment
	return <Fragment>{element}</Fragment>;
}
