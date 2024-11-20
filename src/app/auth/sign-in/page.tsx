import SignInPageContent from "@/app/auth/sign-in/sign-in-page";
import { createI18n } from "@/lib/core/i18n/createI18n";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export namespace SignInPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export interface SearchParamsInput {
    next?: string;
  }
}

export function generateMetadata() {
  const { t } = createI18n();

  const title = t(["common", "pages", "sign-in"]);

  const metadata: Metadata = {
    robots: {
      index: false,
    },
    title,
  };

  return metadata;
}

export default function SignInPage(): ReactNode {
  return <SignInPageContent />;
}
