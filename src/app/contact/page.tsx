import ContactPageContent from "@/app/contact/contact-page";
import type { ReactNode } from "react";
import type { ContactFormValues } from "@/components/contact/ContactForm";
import Contact, { metadata } from "@/components/contact/Contact.mdx";
import { Image } from "@/components/common/Image";
import { Link } from "@/components/common/Link";
import { createI18n } from "@/lib/core/i18n/createI18n";
import type { Metadata } from "next";

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

export default function ContactPage(): ReactNode {
  return (
    <ContactPageContent title={metadata.title}>
      <Contact components={{ Image, Link }} />
    </ContactPageContent>
  );
}
