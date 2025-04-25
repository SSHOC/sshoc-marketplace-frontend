import { useSiteMetadata } from '@/lib/core/metadata/useSiteMetadata'

export type UsePageTitleTemplateResult = (pageTitle?: string) => string

export function usePageTitleTemplate(): UsePageTitleTemplateResult {
  const { title } = useSiteMetadata()

  function titleTemplate(pageTitle?: string) {
    return [pageTitle, title].filter(Boolean).join(' | ')
  }

  return titleTemplate
}
