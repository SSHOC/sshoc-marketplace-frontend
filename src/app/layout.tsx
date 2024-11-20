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
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import { routes } from "@/lib/core/navigation/routes";
import { PageLayout } from "@/lib/core/layouts/PageLayout";

async function getAboutNavMenu() {
  const contentFolderPath = join(
    process.cwd(),
    "src",
    "app",
    "about",
    "[id]",
    "_content"
  );
  const entries = await readdir(contentFolderPath);
  const navigationMenu = await Promise.all(
    entries.map(async (entry) => {
      const vfile = await read(join(contentFolderPath, entry));
      matter(vfile, { strip: true });
      const { navigationMenu } = vfile.data["matter"] as any;

      return {
        id: navigationMenu.title,
        label: navigationMenu.title,
        href: routes.AboutPage({ id: entry.slice(0, -4) }),
        position: navigationMenu.position,
      };
    })
  );
  navigationMenu.sort((a, z) => {
    return a.position - z.position;
  });
  return navigationMenu;
}

async function getContributeNavMenu() {
  const contentFolderPath = join(
    process.cwd(),
    "src",
    "app",
    "contribute",
    "[id]",
    "_content"
  );
  const entries = await readdir(contentFolderPath);
  const navigationMenu = await Promise.all(
    entries.map(async (entry) => {
      const vfile = await read(join(contentFolderPath, entry));
      matter(vfile, { strip: true });
      const { navigationMenu } = vfile.data["matter"] as any;

      return {
        id: navigationMenu.title,
        label: navigationMenu.title,
        href: routes.ContributePage({ id: entry.slice(0, -4) }),
        position: navigationMenu.position,
      };
    })
  );
  navigationMenu.sort((a, z) => {
    return a.position - z.position;
  });
  return navigationMenu;
}

const nav = {
  about: getAboutNavMenu(),
  contribute: getContributeNavMenu(),
};

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
          <PageLayout {...nav}>{children}</PageLayout>
        </Providers>
      </body>
    </html>
  );
}
