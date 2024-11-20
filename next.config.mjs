import createBundleAnalyzer from "@next/bundle-analyzer";
import { log } from "@acdh-oeaw/lib";
import createSvgPlugin from "@stefanprobst/next-svg";

/** @typedef {import('next').NextConfig} NextConfig */

/** @type {NextConfig} */
const config = {
  eslint: {
    dirs: ["."],
    ignoreDuringBuilds: true,
  },
  async headers() {
    const headers = [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        source: "/assets/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, immutable, max-age=31536000",
          },
        ],
      },
    ];

    if (process.env["NEXT_PUBLIC_BOTS"] !== "enabled") {
      headers.push({
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      });

      log.warn("Indexing by search engines is disallowed.");
    }

    return headers;
  },
  images: {
    remotePatterns: process.env["NEXT_PUBLIC_SSHOC_API_BASE_URL"]
      ? [
          {
            protocol: "https",
            hostname: new URL(process.env["NEXT_PUBLIC_SSHOC_API_BASE_URL"])
              .hostname,
            port: "",
            search: "",
          },
        ]
      : undefined,
  },
  output: "standalone",
  poweredByHeader: false,
  /**
   * React Spectrum currently has issues with `StrictMode`.
   *
   * @see e.g. https://github.com/adobe/react-spectrum/issues/977
   */
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

/** @type {Array<(config: NextConfig) => NextConfig>} */
const plugins = [
  createSvgPlugin(),
  createBundleAnalyzer({
    enabled: process.env["BUNDLE_ANALYZER"] === "enabled",
  }),
];

export default plugins.reduce((config, plugin) => {
  return plugin(config);
}, config);
