import generate from '@stefanprobst/favicons'
import { promises as fs } from 'fs'
import * as path from 'path'
import sharp from 'sharp'

import { createFaviconLink, log } from '@/lib/utils/index'
import type { Locale } from '~/config/i18n.config.mjs'
import { siteMetadata } from '~/config/metadata.config'
import { openGraphImageName, webManifest } from '~/config/site.config'

Promise.all(
  Object.entries(siteMetadata).map(async ([locale, { favicon, shortTitle, title, image }]) => {
    const outputFolder = path.join(
      process.cwd(),
      createFaviconLink(locale as Locale, 'public').pathname,
    )

    if (path.extname(favicon.src) === '.svg') {
      await fs.copyFile(path.join(process.cwd(), favicon.src), path.join(outputFolder, 'icon.svg'))
    }

    await generate({
      inputFilePath: favicon.src,
      outputFolder,
      name: title,
      shortName: shortTitle,
      maskable: favicon.maskable,
      color: '#fff',
      manifestFileName: webManifest,
    })

    await sharp(image.src)
      .resize({ width: 1200, height: 628, fit: 'contain', background: 'transparent' })
      .webp()
      .toFile(path.join(outputFolder, openGraphImageName))
  }),
)
  .then(() => {
    log.success('Successfully generated favicons.')
  })
  .catch((error) => {
    log.error('Failed to generate favicons.', error)
  })
