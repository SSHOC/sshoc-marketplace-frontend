export {}

/**
 * Note: `click({ force: true })` seems necessary to avoid detached dom node error.
 * @see https://github.com/cypress-io/cypress/issues/7306
 * Alternatively, what also seems to work is use `should` (which will retry automatically) and
 * trigger the click event manually:
 * ```js
 * cy.findByRole('option').should(el => {
 *   el.click()
 *   return el
 * })
 * ```
 * or
 * ```js
 * cy.findByRole('option').should(el => {
 *   expect(Cypress.dom.isDetached(el)).to.be.false}
 *   return el
 * )
 * ```
 *
 * Note: cypress currently does not support `<kbd>TAB</kbd>` presses.
 * @see https://github.com/cypress-io/cypress/issues/299
 */

describe('Home page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should set document title', () => {
    cy.title().should('equal', 'Home | Social Sciences & Humanities Open Marketplace')
  })

  it('should display page title', () => {
    cy.get('h1').should('contain', 'Social Sciences & Humanities Open Marketplace')
  })

  describe('Search form', () => {
    it('should display autocomplete suggestions and navigate to search page when pressing enter', () => {
      cy.findByRole('combobox', { name: 'Search term' }).type('gephi')
      cy.findAllByRole('option').should('have.length', 3)
      cy.findByRole('option', { name: 'Introduction to GEPHI' }).should('be.visible')
      cy.findByRole('combobox', { name: 'Search term' }).type('{enter}')
      cy.location('pathname').should('equal', '/search')
      cy.location('search').should('equal', '?q=gephi')
    })

    it('should display autocomplete suggestions and navigate to search page when clicking submit button', () => {
      cy.findByRole('combobox', { name: 'Search term' }).type('gephi')
      cy.findAllByRole('option').should('have.length', 3)
      cy.findByRole('option', { name: 'Introduction to GEPHI' }).should('be.visible')
      cy.findByRole('combobox', { name: 'Search term' }).blur()
      cy.findByRole('button', { name: 'Search' }).click()
      cy.location('pathname').should('equal', '/search')
      cy.location('search').should('equal', '?q=gephi')
    })

    it('should display autocomplete suggestions and navigate to search page when selecting suggestion with keyboard', () => {
      cy.findByRole('combobox', { name: 'Search term' }).type('gephi')
      cy.findAllByRole('option').should('have.length', 3)
      cy.findByRole('option', { name: 'Introduction to GEPHI' }).should('be.visible')
      cy.findByRole('combobox', { name: 'Search term' }).type(
        '{downArrow}{downArrow}{downArrow}{enter}',
      )
      cy.location('pathname').should('equal', '/search')
      cy.location('search').should('equal', '?q=Introduction+to+GEPHI')
    })

    it('should display autocomplete suggestions and navigate to search page when selecting suggestion with click', () => {
      cy.findByRole('combobox', { name: 'Search term' }).type('gephi')
      cy.findAllByRole('option').should('have.length', 3)
      cy.findByRole('option', { name: 'Introduction to GEPHI' })
        .should('be.visible')
        .click({ force: true })
      cy.location('pathname').should('equal', '/search')
      cy.location('search').should('equal', '?q=Introduction+to+GEPHI')
    })

    it('should allow selecting item category for search', () => {
      cy.findByRole('button', { name: 'Category All categories' }).click()
      cy.findAllByRole('option').should('have.length', 6)
      cy.findByRole('option', { name: 'Training materials' })
        .should('be.visible')
        .click({ force: true })
      cy.findByRole('combobox', { name: 'Search term' }).type('gephi')
      cy.findAllByRole('option').should('have.length', 2)
      cy.findByRole('option', { name: 'Introduction to GEPHI' }).should('be.visible')
      cy.findByRole('combobox', { name: 'Search term' }).type('{enter}')
      cy.location('pathname').should('equal', '/search')
      cy.location('search').should('equal', '?q=gephi&categories=training-material')
    })
  })
})
