const id = 'main-content'

export interface UseSkipToMainContentResult {
  linkProps: {
    href: {
      hash: string
    }
    onClick: () => void
  }
  targetProps: {
    id: string
    tabIndex: -1
  }
}

export function useSkipToMainContent(): UseSkipToMainContentResult {
  const hash = '#' + id

  function moveFocus() {
    /**
     * Fragment identifier links do not move focus to the target in Firefox.
     */
    document.getElementById(id)?.focus()
  }

  return {
    linkProps: {
      href: {
        hash,
      },
      onClick: moveFocus,
    },
    targetProps: {
      id,
      tabIndex: -1,
    },
  }
}
