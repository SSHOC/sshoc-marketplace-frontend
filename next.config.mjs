import createBundleAnalyzer from "@next/bundle-analyzer";
import { log } from "@stefanprobst/log";
import createSvgPlugin from "@stefanprobst/next-svg";

/** @typedef {import('~/config/i18n.config.mjs').Locale} Locale */
/** @typedef {import('next').NextConfig & {i18n?: {locales: Array<Locale>; defaultLocale: Locale}}} NextConfig */
/** @typedef {import('hast').Element} HastElement */

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
          // {
          //   key: 'Content-Security-Policy',
          //   value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
          // },
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
  i18n: {
    locales,
    defaultLocale,
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
  pageExtensions: ["ts", "tsx", "mdx"],
  poweredByHeader: false,
  /**
   * React Spectrum currently has issues with `StrictMode`.
   *
   * @see e.g. https://github.com/adobe/react-spectrum/issues/977
   */
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/about",
        destination: "/about/service",
      },
      {
        source: "/browse",
        destination: "/browse/activity",
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config, context) {
    /**
     * @see https://github.com/vercel/next.js/discussions/30870
     */
    config.infrastructureLogging = {
      ...config.infrastructureLogging,
      level: "error",
    };

    /** Enable top-level await. */
    config.experiments = config.experiments ?? {};
    config.experiments.topLevelAwait = true;

    /**
     * @see https://github.com/vercel/next.js/issues/17806
     */
    config.module?.rules?.push({
      test: /\.mjs$/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      },
    });

    /** Evaluate modules at build-time. */
    config.module?.rules?.push({
      test: /\.static\.ts$/,
      use: [{ loader: "@stefanprobst/val-loader" }],
      exclude: /node_modules/,
    });

    // /** Page sections. */
    // config.module?.rules?.push({
    //   test: /\.mdx$/,
    //   include: path.join(process.cwd(), "src", "components"),
    //   use: [
    //     context.defaultLoaders.babel,
    //     {
    //       loader: "@mdx-js/loader",
    //       /** @type {MdxOptions} */
    //       options: {
    //         jsx: true,
    //         remarkPlugins: [
    //           withFrontmatter,
    //           withParsedFrontmatter,
    //           withParsedFrontmatterExport,
    //           withGfm,
    //           withSmartQuotes,
    //         ],
    //         rehypePlugins: [
    //           withNoReferrerLinks,
    //           withNextLinks,
    //           withImageCaptions,
    //           withNextImage,
    //           withListsWithAriaRole,
    //           withHeadingIds,
    //           [withHeadingFragmentLinks, { generate: createPermalink }],
    //         ],
    //       },
    //     },
    //   ],
    // });

    return config;
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
