"use client";

import PrivacyPolicyPageContent from "@/app/privacy-policy/privacy-policy-page";
import type { IsoDateString } from "@/lib/core/types";
import PrivacyPolicy, {
  metadata,
} from "@/app/privacy-policy/_content/PrivacyPolicy.mdx";
import { Image } from "@/components/common/Image";
import { Link } from "@/components/common/Link";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { createI18n } from "@/lib/core/i18n/createI18n";
import { join } from "node:path";
import { getLastUpdatedTimestamp } from "@/lib/data/git/get-last-updated-timestamp";

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
    "/app/privacy-policy/_content/PrivacyPolicy.mdx"
  );
  const lastUpdatedTimestamp = (
    await getLastUpdatedTimestamp(filePath)
  ).toISOString();

  return (
    <PrivacyPolicyPageContent
      lastUpdatedTimestamp={lastUpdatedTimestamp}
      title={metadata.title}
    >
      <PrivacyPolicy components={{ Image, Link }} />
    </PrivacyPolicyPageContent>
  );
}
