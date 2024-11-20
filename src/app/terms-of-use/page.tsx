import TermsOfUsePageContent from "@/app/terms-of-use/terms-of-use-page";
import { Image } from "@/components/common/Image";
import { Link } from "@/components/common/Link";
import { getLastUpdatedTimestamp } from "@/lib/data/git/get-last-updated-timestamp";
import type { IsoDateString } from "@/lib/core/types";
import TermsOfUse, {
  metadata,
} from "@/app/terms-of-use/_content/TermsOfUse.mdx";
import type { ReactNode } from "react";
import { join } from "node:path";
import type { Metadata } from "next";
import { createI18n } from "@/lib/core/i18n/createI18n";

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
    "/app/terms-of-use/_content/TermsOfUse.mdx"
  );
  const lastUpdatedTimestamp = (
    await getLastUpdatedTimestamp(filePath)
  ).toISOString();

  return (
    <TermsOfUsePageContent
      lastUpdatedTimestamp={lastUpdatedTimestamp}
      title={metadata.title}
    >
      <TermsOfUse components={{ Image, Link }} />
    </TermsOfUsePageContent>
  );
}
