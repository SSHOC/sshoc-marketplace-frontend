import ContactPageContent from "@/app/contact/contact-page";
import type { ReactNode } from "react";
import type { ContactFormValues } from "@/components/contact/ContactForm";
import { Image } from "@/components/common/Image";
import { Link } from "@/components/common/Link";
import { createI18n } from "@/lib/core/i18n/createI18n";
import type { Metadata } from "next";
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
import { join } from "node:path";

export namespace ContactPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Partial<ContactFormValues>;
}

export function generateMetadata() {
  const { t } = createI18n();

  const title = t(["authenticated", "pages", "actors"]);

  const metadata: Metadata = {
    robots: {
      index: false,
    },
    title,
  };

  return metadata;
}

export default async function ContactPage(): Promise<ReactNode> {
  const filePath = join(process.cwd(), "/src/app/contact/_content/Contact.mdx");

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
    <ContactPageContent title={title}>
      <Content components={{ Image, Link }} />
    </ContactPageContent>
  );
}
