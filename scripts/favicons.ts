import generate from '@stefanprobst/favicons'
import { log } from '@/utils/log'
import { image, title, shortTitle } from '@@/config/metadata.json'

generate({
  inputFilePath: image.src,
  outputFolder: 'public',
  name: title,
  shortName: shortTitle,
  maskable: true,
  color: '#fff',
})
  .then(() => log.success('Successfully generated favicons.'))
  .catch(log.error)
