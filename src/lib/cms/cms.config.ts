import type { CmsConfig } from 'decap-cms-core'

import { collection as aboutPages } from '@/lib/cms/collections/about-pages'
import { collection as contributePages } from '@/lib/cms/collections/contribute-pages'
import { collection as pageSections } from '@/lib/cms/collections/page-sections'
import { backend, logo, siteUrl, useLocalBackend } from '~/config/cms.config'

export const config: CmsConfig = {
  load_config_file: false,
  local_backend: useLocalBackend,
  backend: {
    name: backend.provider,
    repo: backend.repo,
    branch: backend.branch,
    auth_scope: backend.isPublic ? 'public_repo' : 'repo',

    base_url: backend.auth.apiBaseUrl,
    auth_endpoint: backend.auth.endpoint,

    open_authoring: false,
    squash_merges: true,
    commit_messages: {
      create: 'cms: create {{collection}} "{{slug}}"',
      update: 'cms: update {{collection}} "{{slug}}"',
      delete: 'cms: delete {{collection}} "{{slug}}"',
      uploadMedia: 'cms: upload media "{{path}}"',
      deleteMedia: 'cms: delete media "{{path}}"',
    },
  },
  slug: {
    encoding: 'unicode',
    clean_accents: false,
  },
  media_folder: 'public/assets/cms/images',
  public_folder: '/assets/cms/images',
  site_url: siteUrl,
  logo_url: logo,
  editor: {
    preview: false,
  },
  collections: [aboutPages, contributePages, pageSections],
}
