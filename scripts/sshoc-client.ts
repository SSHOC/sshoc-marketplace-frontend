import { promises as fs, existsSync } from 'fs'
import { join } from 'path'
import { loadEnvConfig } from '@next/env'
import prettierConfig from '@stefanprobst/prettier-config'
import fetch from 'node-fetch'
import { generate } from 'openapi-ts-client'
import { log } from '@/utils/log'

/** load environment variables from `.env.local` */
loadEnvConfig(process.cwd(), false)

const openApiDocumentUrl =
  process.env.SSHOC_OPENAPI_DOCUMENT_URL ?? 'http://localhost:8080/v3/api-docs'

const outputFolder = join(process.cwd(), 'src', 'api', 'sshoc')
const outputFile = join(outputFolder, 'index.ts')

async function run() {
  const response = await fetch(openApiDocumentUrl)
  const openApiDocument = await response.json()

  const client = await generate({
    openApiDocument,
    prettierConfig,
  })

  if (!existsSync(outputFolder)) {
    await fs.mkdir(outputFolder, { recursive: true })
  }
  await fs.writeFile(outputFile, client, { encoding: 'utf-8' })

  log.success('Successfully generated sshoc api client.')
}

run().catch(log.error)
