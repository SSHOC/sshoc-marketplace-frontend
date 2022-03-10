const path = require('path')

/** @type {import('@storybook/react/types').StorybookConfig} */
const config = {
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-a11y'],
  /** @see https://github.com/storybookjs/storybook/pull/15220 */
  /* @ts-expect-error Missing in https://github.com/storybookjs/storybook/blob/next/lib/core-common/src/types.ts#L278-L381 */
  async babel() {
    return { presets: ['next/babel'] }
  },
  core: {
    builder: 'webpack5',
  },
  features: {
    babelModeV7: true,
    breakingChangesV7: true,
    storyStoreV7: true,
  },
  framework: '@storybook/react',
  logLevel: 'error',
  reactOptions: {
    fastRefresh: true,
    /**
     * React Spectrum currently has issues with `StrictMode`.
     *
     * @see e.g. https://github.com/adobe/react-spectrum/issues/977
     */
    strictMode: false,
  },
  staticDirs: ['../public'],
  stories: [{ directory: '../stories/__stories__' }],
  webpackFinal(config) {
    config.resolve = config.resolve ?? {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(process.cwd(), 'src'),
      '~': process.cwd(),
    }

    config.module?.rules?.unshift({
      test: /\.mjs$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    })

    config.module?.rules?.unshift({
      test: /\.static\.ts$/,
      use: [{ loader: '@stefanprobst/val-loader' }],
      exclude: /node_modules/,
    })

    const id = '__root__'

    const svgoLoader = {
      loader: 'svgo-loader',
      options: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
          'prefixIds',
          'convertStyleToAttrs',
          'removeDimensions',
          {
            name: 'addAttributesToSVGElement',
            params: {
              attributes: [{ id }],
            },
          },
        ],
      },
    }

    const svgSymbolLoader = {
      resourceQuery: /symbol/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['next/babel'],
          },
        },
        {
          loader: '@stefanprobst/next-svg/svg-symbol-loader',
          options: { isServer: false, basePath: '', id },
        },
      ],
    }
    const svgSymbolIconLoader = {
      resourceQuery: /symbol-icon/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['next/babel'],
          },
        },
        {
          loader: '@stefanprobst/next-svg/svg-symbol-loader',
          options: { isServer: false, basePath: '', id, icon: true },
        },
      ],
    }

    const svgInlineLoader = {
      resourceQuery: /inline/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['next/babel'],
          },
        },
        {
          loader: '@stefanprobst/next-svg/svg-inline-loader',
          options: {},
        },
      ],
    }
    const svgInlineIconLoader = {
      resourceQuery: /inline-icon/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['next/babel'],
          },
        },
        {
          loader: '@stefanprobst/next-svg/svg-inline-loader',
          options: { icon: true },
        },
      ],
    }

    const oneOf = [svgSymbolIconLoader, svgSymbolLoader, svgInlineIconLoader, svgInlineLoader]

    config.module?.rules?.push({
      test: /\.svg$/,
      issuer: { not: /\.(css|scss|sass)$/ },
      dependency: { not: ['url'] },
      /** Avoid svg being processed again by asset module loader. */
      type: 'javascript/auto',
      rules: [
        {
          oneOf: [
            ...oneOf,
            {
              loader: '@stefanprobst/next-image-loader',
            },
          ],
        },
        svgoLoader,
      ],
    })

    /**
     * We add the postcss loader manually instead of using `@storybook/addon-postcss`,
     * so it handles tsconfig paths via `resolve.alias`.
     */
    const cssRule = config.module?.rules?.find((rule) => {
      if (typeof rule === 'string') return false
      if (!(rule.test instanceof RegExp)) return false
      return rule.test.test('filename.css')
    })

    if (cssRule != null && typeof cssRule !== 'string' && Array.isArray(cssRule.use)) {
      cssRule.use.push({
        loader: '@storybook/addon-postcss/node_modules/postcss-loader',
        options: {
          implementation: require('postcss'),
        },
      })
    }

    return config
  },
}

module.exports = config
