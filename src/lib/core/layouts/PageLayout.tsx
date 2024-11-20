"use client";

import type { ReactNode } from "react";

import { useI18n } from "@/lib/core/i18n/useI18n";
import css from "@/lib/core/layouts/PageLayout.module.css";
import { AuthHeader } from "@/lib/core/page/AuthHeader";
import { PageFooter } from "@/lib/core/page/PageFooter";
import { PageHeader } from "@/lib/core/page/PageHeader";
import { SkipLink } from "@/lib/core/page/SkipLink";

export interface PageLayoutProps {
  children?: ReactNode;
  about: any;
  contribute: any;
}

export function PageLayout(props: PageLayoutProps): JSX.Element {
  const { t } = useI18n<"common">();

  return (
    <div className={css["page-layout"]}>
      <SkipLink>{t(["common", "skip-to-main-content"])}</SkipLink>
      <PageHeader about={props.about} contribute={props.contribute} />
      <AuthHeader />
      {props.children}
      <PageFooter />
    </div>
  );
}
