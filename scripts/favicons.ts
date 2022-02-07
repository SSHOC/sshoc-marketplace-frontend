import generate from '@stefanprobst/favicons'

import { log } from '@/utils/log'
import { image, shortTitle, title } from '~/config/metadata.json'

generate({
  inputFilePath: image.src,
  outputFolder: 'public',
  name: title,
  shortName: shortTitle,
  maskable: true,
  color: '#fff',
})
  .then(() => {
    return log.success('Successfully generated favicons.')
  })
  .catch(log.error)
