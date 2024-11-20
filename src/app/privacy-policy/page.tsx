import PrivacyPolicyPageContent from "@/app/privacy-policy/privacy-policy-page";
import type { IsoDateString } from "@/lib/core/types";
import { Image } from "@/components/common/Image";
import { Link } from "@/components/common/Link";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { createI18n } from "@/lib/core/i18n/createI18n";
import { join } from "node:path";
import { getLastUpdatedTimestamp } from "@/lib/data/git/get-last-updated-timestamp";
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

export namespace PrivacyPolicyPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    lastUpdatedTimestamp: IsoDateString;
  }
}

export function generateMetadata() {
  const { t } = createI18n();

  const title = t(["common", "pages", "privacy-policy"]);

  const metadata: Metadata = {
    title,
  };

  return metadata;
}

export default async function PrivacyPolicyPage(
  props: PrivacyPolicyPage.Props
): Promise<ReactNode> {
  const filePath = join(
    process.cwd(),
    "/src/app/privacy-policy/_content/PrivacyPolicy.mdx"
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
    <PrivacyPolicyPageContent
      lastUpdatedTimestamp={lastUpdatedTimestamp.toISOString()}
      title={title}
    >
      <Content components={{ Image, Link }} />
    </PrivacyPolicyPageContent>
  );
}
