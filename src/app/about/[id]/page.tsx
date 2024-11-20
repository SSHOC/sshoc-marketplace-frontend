import { readdir } from "node:fs/promises";
import { basename, join } from "node:path";

import { Image } from "@/components/common/Image";
import { Link } from "@/components/common/Link";
import AboutPageContent from "@/app/about/[id]/about-page";
import type { WithDictionaries } from "@/lib/core/i18n/types";
import type { IsoDateString } from "@/lib/core/types";
import { getLastUpdatedTimestamp } from "@/lib/data/git/get-last-updated-timestamp";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import { routes } from "@/lib/core/navigation/routes";
import {
  type TableOfContents,
  withTableOfContents,
  typographyConfig,
} from "@acdh-oeaw/mdx-lib";
import withGfm from "remark-gfm";
import withFrontmatter from "remark-frontmatter";
import withMdxFrontmatter from "remark-mdx-frontmatter";
import withHeadingIds from "rehype-slug";
import withSyntaxHighlighting from "@shikijs/rehype";
import withTypographicQuotes from "remark-smartypants";

import { syntaxHighlightingTheme } from "~/config/docs.config.mjs";

interface AboutPageMetadata {
  title: string;
  navigationMenu: {
    title: string;
    position: number;
  };
}

interface ExtendedAboutPageMetadata extends AboutPageMetadata {
  tableOfContents: TableOfContents;
  toc: true;
}

const contentFolderPath = join(
  process.cwd(),
  "src",
  "app",
  "about",
  "[id]",
  "_content"
);

export namespace AboutPage {
  export interface PathParamsInput extends ParamsInput {
    id: string;
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props extends WithDictionaries<"common"> {
    lastUpdatedTimestamp: IsoDateString;
    params: PathParams;
  }
}

export async function generateStaticParams() {
  const entries = await readdir(contentFolderPath);

  const ids = entries.map((entry) => {
    return basename(entry);
  });

  return ids.map((id) => {
    return { params: { id } };
  });
}

export default async function AboutPageContainer(
  props: AboutPage.Props
): Promise<Promise<JSX.Element>> {
  const { id } = props.params;

  const entries = await readdir(contentFolderPath);
  const navigationMenu = await Promise.all(
    entries.map(async (entry) => {
      const vfile = await read(join(contentFolderPath, entry));
      matter(vfile, { strip: true });
      const { navigationMenu } = vfile.data["matter"] as AboutPageMetadata;

      return {
        id: navigationMenu.title,
        label: navigationMenu.title,
        href: routes.AboutPage({ id }),
        position: navigationMenu.position,
      };
    })
  );
  navigationMenu.sort((a, z) => {
    return a.position - z.position;
  });

  const filePath = join(contentFolderPath, `${id}.mdx`);

  const lastUpdatedTimestamp = await getLastUpdatedTimestamp(filePath);

  const vfile = await read(filePath);
  matter(vfile, { strip: true });
  const { default: Content } = await evaluate(vfile, {
    ...runtime,
    remarkPlugins: [
      withFrontmatter,
      withMdxFrontmatter,
      withGfm,
      [withTypographicQuotes, typographyConfig],
    ],
    remarkRehypeOptions: {
      footnoteLabel: "Footnotes",
      footnoteBackLabel: "Back to content",
    },
    rehypePlugins: [
      withHeadingIds,
      withTableOfContents,
      [withSyntaxHighlighting, { theme: syntaxHighlightingTheme }],
    ],
  });
  const { tableOfContents, title, toc } = vfile.data
    .matter as ExtendedAboutPageMetadata;

  return (
    <AboutPageContent
      id={id}
      lastUpdatedTimestamp={lastUpdatedTimestamp.toISOString()}
      navigationMenu={navigationMenu}
      tableOfContents={toc ? tableOfContents : undefined}
      title={title}
    >
      <Content
        components={{
          Link,
          Image,
        }}
      />
    </AboutPageContent>
  );
}
