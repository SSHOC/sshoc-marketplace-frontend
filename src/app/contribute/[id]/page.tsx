import { readdir } from "node:fs/promises";
import { basename, join } from "node:path";

import ContributePage from "@/app/contribute/[id]/contribute-page";
import type { WithDictionaries } from "@/lib/core/i18n/types";
import type { IsoDateString } from "@/lib/core/types";
import { getLastUpdatedTimestamp } from "@/lib/data/git/get-last-updated-timestamp";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import { routes } from "@/lib/core/navigation/routes";
import { Image } from "@/components/common/Image";
import { Link } from "@/components/common/Link";

import withToc, { type Toc } from "@stefanprobst/rehype-extract-toc";
import withTocExport from "@stefanprobst/rehype-extract-toc/mdx";
import withHeadingFragmentLinks from "@stefanprobst/rehype-fragment-links";
import withImageCaptions from "@stefanprobst/rehype-image-captions";
import withListsWithAriaRole from "@stefanprobst/rehype-lists-with-aria-role";
import withNextImage from "@stefanprobst/rehype-next-image";
import withNextLinks from "@stefanprobst/rehype-next-links";
import withNoReferrerLinks from "@stefanprobst/rehype-noreferrer-links";
import withSyntaxHighlighting from "@shikijs/rehype";
import withParsedFrontmatter from "@stefanprobst/remark-extract-yaml-frontmatter";
import withParsedFrontmatterExport from "@stefanprobst/remark-extract-yaml-frontmatter/mdx";
import withSmartQuotes from "@stefanprobst/remark-smart-quotes";
import withHeadingIds from "rehype-slug";
import withFrontmatter from "remark-frontmatter";
import withGfm from "remark-gfm";
// import { headingRank } from "hast-util-heading-rank";
// import { h } from "hastscript";
import { syntaxHighlightingTheme } from "~/config/docs.config.mjs";
import { collection } from "@/lib/cms/collections/contribute-pages";

interface ContributePageMetadata {
  title: string;
  navigationMenu: {
    title: string;
    position: number;
  };
}

interface ExtendedContributePageMetadata extends ContributePageMetadata {
  tableOfContents: Toc;
  toc: true;
}

const contentFolderPath = join(process.cwd(), collection.folder!);

export namespace ContributePage {
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

export default async function ContributePageContainer(
  props: ContributePage.Props
): Promise<Promise<JSX.Element>> {
  const { id } = props.params;

  const entries = await readdir(contentFolderPath);
  const navigationMenu = await Promise.all(
    entries.map(async (entry) => {
      const vfile = await read(join(contentFolderPath, entry));
      matter(vfile, { strip: true });
      const { navigationMenu } = vfile.data["matter"] as ContributePageMetadata;

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
      withParsedFrontmatter,
      withParsedFrontmatterExport,
      withGfm,
      // withSmartQuotes,
    ],
    remarkRehypeOptions: {
      footnoteLabel: "Footnotes",
      footnoteBackLabel: "Back to content",
    },
    rehypePlugins: [
      // withNoReferrerLinks,
      // withNextLinks,
      // withImageCaptions,
      // withNextImage,
      // withListsWithAriaRole,
      withHeadingIds,
      // withHeadingFragmentLinks,
      withToc,
      withTocExport,
      [withSyntaxHighlighting, { theme: syntaxHighlightingTheme }],
    ],
  });
  const { tableOfContents, title, toc } = vfile.data
    .matter as ExtendedContributePageMetadata;

  return (
    <ContributePage
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
    </ContributePage>
  );
}

// /** @type {(heading: HastElement, id: string) => Array<HastElement>} */
// function createPermalink(headingElement, id) {
//   const permaLinkId = ["permalink", id].join("-");
//   const ariaLabelledBy = [permaLinkId, id].join(" ");

//   return [
//     h(
//       "div",
//       { dataPermalink: true, dataRank: headingRank(headingElement) },
//       [
//         h("a", { ariaLabelledBy, href: "#" + id }, [
//           h("span", { id: permaLinkId, hidden: true }, "Permalink to"),
//           h("span", "#"),
//         ]),
//         headingElement,
//       ]
//     ),
//   ];
// }
