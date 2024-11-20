import SignUpPageContent from "@/app/auth/sign-up/sign-up-page";
import { createI18n } from "@/lib/core/i18n/createI18n";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export namespace SignUpPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export interface SearchParamsInput {
    next?: string;
  }
}

export function generateMetadata() {
  const { t } = createI18n();

  const title = t(["common", "pages", "sign-up"]);

  const metadata: Metadata = {
    robots: {
      index: false,
    },
    title,
  };

  return metadata;
}

export default function SignUpPage(): ReactNode {
  return <SignUpPageContent />;
}
