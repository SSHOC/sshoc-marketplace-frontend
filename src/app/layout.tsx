/** Needs to be imported before `src/styles/index.css` so we can overwrite custom properties. */
import "react-toastify/dist/ReactToastify.css";
import "@/styles/index.css";

import { load } from "@/lib/core/i18n/load";
import type { ReactNode } from "react";
import { googleSiteId } from "~/config/site.config";
import type { Metadata } from "next";
import { AnalyticsScript } from "@/lib/core/analytics/AnalyticsScript";
import { reportPageView } from "@/lib/core/analytics/analytics-service";
import { ContextProviders as Providers } from "@/app/_components/providers";

// FIXME: port <SiteMetadata /> from @/lib/core/metadata/SiteMetadata

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  verification: {
    google: googleSiteId,
  },
};

export default async function RootLayout(
  props: RootLayoutProps
): Promise<ReactNode> {
  const { children } = props;

  const locale = "en";
  const dictionaries = await load(locale, ["common"]);

  // reportPageView(); // FIXME: move to client component

  return (
    <html lang="en">
      <AnalyticsScript />

      <body>
        <Providers
          isPageAccessible={true} // FIXME:
          pageProps={{
            dictionaries,
            initialQueryState: undefined,
          }}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
