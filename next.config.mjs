/* @ts-expect-error Missing module declaration. */
import createBundleAnalyzerPlugin from '@next/bundle-analyzer'
import { log } from '@stefanprobst/log'
import { RouteManifestPlugin } from '@stefanprobst/next-route-manifest'
/* @ts-expect-error Missing module declaration. */
import createSvgPlugin from '@stefanprobst/next-svg'
import prettierOptions from '@stefanprobst/prettier-config'
import withToc from '@stefanprobst/rehype-extract-toc'
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx'
import withImageCaptions from '@stefanprobst/rehype-image-captions'
import withListsWithAriaRole from '@stefanprobst/rehype-lists-with-aria-role'
import withNextImage from '@stefanprobst/rehype-next-image'
import withNextLinks from '@stefanprobst/rehype-next-links'
import withNoReferrerLinks from '@stefanprobst/rehype-noreferrer-links'
import withParsedFrontmatter from '@stefanprobst/remark-extract-yaml-frontmatter'
import withParsedFrontmatterExport from '@stefanprobst/remark-extract-yaml-frontmatter/mdx'
import withPage from '@stefanprobst/remark-mdx-page'
import withSmartQuotes from '@stefanprobst/remark-smart-quotes'
import * as path from 'path'
import withHeadingIds from 'rehype-slug'
import withFrontmatter from 'remark-frontmatter'
import withGfm from 'remark-gfm'

const isProductionDeploy =
  process.env['NEXT_PUBLIC_SSHOC_BASE_URL'] === 'https://marketplace.sshopencloud.eu'

/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {import('webpack').Configuration} WebpackConfig */
/** @typedef {import('@mdx-js/loader').Options} MdxOptions */
/** @typedef {import('@stefanprobst/remark-mdx-page').Options} MdxPageOptions */
/** @typedef {import('@stefanprobst/next-route-manifest').Options} RouteManifestConfig */

/** @type {RouteManifestConfig} */
export const routeManifestConfig = {
  outputFolder: path.join(process.cwd(), 'src', 'lib', 'core', 'navigation'),
  pagesFolder: path.join(process.cwd(), 'src', 'pages'),
  pageExtensions: ['page.tsx', 'page.template.tsx'],
  prettierOptions,
}

/** @type {NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['.'],
    ignoreDuringBuilds: true,
  },
  async headers() {
    const headers = [
      {
        source: '/assets/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
    ]

    if (!isProductionDeploy) {
      headers.push({
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      })

      log.warn('Indexing by search engines is disallowed.')
    }

    return headers
  },
  pageExtensions: ['page.tsx', 'page.mdx', 'api.ts'],
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/about',
        destination: '/about/service',
      },
      {
        source: '/browse',
        destination: '/browse/activity',
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(/** @type {WebpackConfig} */ config, context) {
    config.infrastructureLogging = {
      ...config.infrastructureLogging,
      level: 'error',
    }

    config.resolve = config.resolve ?? {}
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
      'react/jsx-runtime': 'react/jsx-runtime.js',
    }

    config.module?.rules?.push({
      test: /\.mjs$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    })

    config.module?.rules?.push({
      test: /\.static\.ts$/,
      use: [{ loader: '@stefanprobst/val-loader' }],
      exclude: /node_modules/,
    })

    // FIXME: enable once page components export types
    // if (!context.isServer) {
    //   config.plugins?.push(new RouteManifestPlugin(routeManifestConfig))
    // }

    config.module?.rules?.push({
      test: /\.mdx?$/,
      include: path.join(process.cwd(), 'src', 'components'),
      use: [
        context.defaultLoaders.babel,
        {
          loader: '@mdx-js/loader',
          /** @type {MdxOptions} */
          options: {
            jsx: true,
            remarkPlugins: [
              withFrontmatter,
              withParsedFrontmatter,
              withParsedFrontmatterExport,
              withGfm,
              withSmartQuotes,
            ],
            rehypePlugins: [
              withNoReferrerLinks,
              withNextLinks,
              withImageCaptions,
              withNextImage,
              withListsWithAriaRole,
              withHeadingIds,
            ],
          },
        },
      ],
    })

    const aboutPageTemplate = path.join(
      process.cwd(),
      'src',
      'pages',
      'about',
      '[id].page.template.tsx',
    )
    config.module?.rules?.push({
      test: /\.page\.mdx$/,
      include: path.join(process.cwd(), 'src', 'pages', 'about'),
      use: [
        {
          loader: path.join(process.cwd(), 'scripts', 'add-dependencies.loader.cjs'),
          options: { dependencies: [aboutPageTemplate] },
        },
        context.defaultLoaders.babel,
        {
          loader: '@mdx-js/loader',
          /** @type {MdxOptions} */
          options: {
            jsx: true,
            remarkPlugins: [
              withFrontmatter,
              withParsedFrontmatter,
              withParsedFrontmatterExport,
              withGfm,
              withSmartQuotes,
            ],
            rehypePlugins: [
              withNoReferrerLinks,
              withNextLinks,
              withImageCaptions,
              withNextImage,
              withListsWithAriaRole,
              withHeadingIds,
              withToc,
              withTocExport,
            ],
            recmaPlugins: [
              [
                withPage,
                /** @type {MdxPageOptions} */
                ({
                  template: aboutPageTemplate,
                  imports: [
                    'import { Image } from "@/components/common/Image"',
                    'import { Link } from "@/lib/core/navigation/Link"',
                  ],
                  props: '{ components: { Image, Link }, metadata, tableOfContents }',
                }),
              ],
            ],
          },
        },
      ],
    })

    const contributePageTemplate = path.join(
      process.cwd(),
      'src',
      'pages',
      'contribute',
      '[id].page.template.tsx',
    )
    config.module?.rules?.push({
      test: /\.page\.mdx$/,
      include: path.join(process.cwd(), 'src', 'pages', 'contribute'),
      use: [
        {
          loader: path.join(process.cwd(), 'scripts', 'add-dependencies.loader.cjs'),
          options: { dependencies: [contributePageTemplate] },
        },
        context.defaultLoaders.babel,
        {
          loader: '@mdx-js/loader',
          /** @type {MdxOptions} */
          options: {
            jsx: true,
            remarkPlugins: [
              withFrontmatter,
              withParsedFrontmatter,
              withParsedFrontmatterExport,
              withGfm,
              withSmartQuotes,
            ],
            rehypePlugins: [
              withNoReferrerLinks,
              withNextLinks,
              withImageCaptions,
              withNextImage,
              withListsWithAriaRole,
              withHeadingIds,
              withToc,
              withTocExport,
            ],
            recmaPlugins: [
              [
                withPage,
                /** @type {MdxPageOptions} */
                ({
                  template: contributePageTemplate,
                  imports: [
                    'import { Image } from "@/components/common/Image"',
                    'import { Link } from "@/lib/core/navigation/Link"',
                  ],
                  props: '{ components: { Image, Link }, metadata, tableOfContents }',
                }),
              ],
            ],
          },
        },
      ],
    })

    return config
  },
}

/** @type {Array<(config: NextConfig) => NextConfig>} */
const plugins = [
  createBundleAnalyzerPlugin({
    enabled: process.env['BUNDLE_ANALYZER'] === 'enabled',
  }),
  createSvgPlugin({
    svgo: {
      plugins: [{ prefixIds: true }, { removeDimensions: true }, { removeViewBox: false }],
    },
    svgr: {
      titleProp: true,
    },
  }),
]

export default plugins.reduce((config, plugin) => {
  return plugin(config)
}, nextConfig)
