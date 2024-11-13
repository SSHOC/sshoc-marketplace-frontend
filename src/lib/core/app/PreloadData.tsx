import { createUrl } from "@/lib/data/sshoc/lib/client";

export function PreloadData(): JSX.Element {
  return (
    <link
      rel="preload"
      as="fetch"
      href={String(createUrl({ pathname: "/api/items-categories" }))}
      crossOrigin="anonymous"
      type="application/json"
    />
  );
}
