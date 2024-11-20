import TermsOfUsePageContent from "@/app/terms-of-use/terms-of-use-page";
import { Image } from "@/components/common/Image";
import { Link } from "@/components/common/Link";
import { getLastUpdatedTimestamp } from "@/lib/data/git/get-last-updated-timestamp";
import type { IsoDateString } from "@/lib/core/types";
import type { ReactNode } from "react";
import { join } from "node:path";
import type { Metadata } from "next";
import { createI18n } from "@/lib/core/i18n/createI18n";
import { evaluate } from "@mdx-js/mdx";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import * as runtime from "react/jsx-runtime";
import { typographyConfig } from "@acdh-oeaw/mdx-lib";
import withGfm from "remark-gfm";
import withFrontmatter from "remark-frontmatter";
import withMdxFrontmatter from "remark-mdx-frontmatter";
import withHeadingIds from "rehype-slug";
import withTypographicQuotes from "remark-smartypants";

export namespace TermsOfUsePage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    lastUpdatedTimestamp: IsoDateString;
  }
}

export function generateMetadata() {
  const { t } = createI18n();

  const title = t(["common", "pages", "terms-of-use"]);

  const metadata: Metadata = {
    robots: {
      index: false,
    },
    title,
  };

  return metadata;
}

export default async function TermsOfUsePage(
  props: TermsOfUsePage.Props
): Promise<ReactNode> {
  const filePath = join(
    process.cwd(),
    "/src/app/terms-of-use/_content/TermsOfUse.mdx"
  );
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
    rehypePlugins: [withHeadingIds],
  });
  const { title } = vfile.data.matter as { title: string };

  return (
    <TermsOfUsePageContent
      lastUpdatedTimestamp={lastUpdatedTimestamp.toISOString()}
      title={title}
    >
      <Content components={{ Image, Link }} />
    </TermsOfUsePageContent>
  );
}
