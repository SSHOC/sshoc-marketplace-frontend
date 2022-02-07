/* @ts-expect-error Missing module declaration. */
import createBundleAnalyzerPlugin from '@next/bundle-analyzer'
import createSvgPlugin from '@stefanprobst/next-svg'
import withParsedFrontmatter from '@stefanprobst/remark-extract-yaml-frontmatter'
import withParsedFrontmatterExport from '@stefanprobst/remark-extract-yaml-frontmatter/mdx'
import withSmartQuotes from '@stefanprobst/remark-smart-quotes'
import withFrontmatter from 'remark-frontmatter'
import withGfm from 'remark-gfm'

/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {import('webpack').Configuration} WebpackConfig */
/** @typedef {import('@mdx-js/loader').Options} MdxOptions */

function isProductionDeploy() {
  return process.env['NEXT_PUBLIC_SSHOC_BASE_URL'] === 'https://marketplace.sshopencloud.eu'
}

/** @type {NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['.'],
    ignoreDuringBuilds: true,
  },
  async headers() {
    if (isProductionDeploy()) {
      return []
    }

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ]
  },
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
    config.infrastructureLogging = { level: 'error' }

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

    config.module.rules.push({
      test: /\.mdx?$/,
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
            rehypePlugins: [],
            recmaPlugins: [],
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
