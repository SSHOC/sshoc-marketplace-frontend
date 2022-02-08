import generate from '@stefanprobst/favicons'
import { log } from '@stefanprobst/log'
import { promises as fs } from 'fs'
import * as path from 'path'
import sharp from 'sharp'

import { siteMetadata } from '~/config/metadata.config'
import { openGraphImageName, webManifest } from '~/config/site.config'

const { favicon, image, shortTitle, title } = siteMetadata

async function run() {
  const outputFolder = path.join(process.cwd(), 'public')

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
}

run()
  .then(() => {
    log.success('Successfully generated favicons.')
  })
  .catch((error) => {
    log.error('Failed to generate favicons.', error)
  })
