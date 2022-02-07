import createBundleAnalyzerPlugin from '@next/bundle-analyzer'
import createSvgPlugin from '@stefanprobst/next-svg'
import createPrevalPlugin from 'next-plugin-preval/config.js'

const withBundleAnalyzer = createBundleAnalyzerPlugin({
  enabled: process.env.ANALYZE === 'true',
})

const withMdx = (nextConfig = {}) => {
  return {
    ...nextConfig,
    webpack(config, options) {
      config.module.rules.push({
        test: /\.mdx?$/,
        use: [options.defaultLoaders.babel, '@mdx-js/loader', './frontmatter'],
      })
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }
      return config
    },
  }
}

const withSvg = createSvgPlugin({
  svgo: {
    plugins: [
      { prefixIds: true },
      { removeDimensions: true },
      { removeViewBox: false },
    ],
  },
  svgr: {
    titleProp: true,
  },
})

const withPreval = createPrevalPlugin()

const nextConfig = {
  async headers() {
    if (
      process.env['NEXT_PUBLIC_SSHOC_BASE_URL'] ===
      'https://marketplace.sshopencloud.eu'
    ) {
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
  images: {},
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
}

const plugins = [withBundleAnalyzer, withMdx, withSvg, withPreval]

export default plugins.reduce((acc, plugin) => plugin(acc), nextConfig)
