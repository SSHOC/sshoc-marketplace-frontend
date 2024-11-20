import NotFoundPageContent from "@/app/not-found-page";
import type { ReactNode } from "react";

export namespace NotFoundPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
}

export default function NotFoundPage(): ReactNode {
  return <NotFoundPageContent />;
}
