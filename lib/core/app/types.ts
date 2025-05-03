import type { AppProps as NextAppProps } from "next/app";
import type { Messages } from "next-intl";
import type { ReactNode } from "react";

import type { User } from "@/data/sshoc/api/user";
import type { DehydratedState } from "@/lib/core/query/QueryProvider";

export type GetLayout = (page: ReactNode, pageProps: SharedPageProps) => ReactNode;

export type PageComponent<T = unknown> = NextAppProps<T>["Component"] & {
	getLayout?: GetLayout | undefined;
	isPageAccessible?: boolean | ((user: User) => boolean) | undefined;
};

export interface SharedPageProps {
	messages?: Messages;
	initialQueryState?: DehydratedState;
}

export interface AppProps extends NextAppProps {
	Component: PageComponent<SharedPageProps>;
	pageProps: SharedPageProps;
}
