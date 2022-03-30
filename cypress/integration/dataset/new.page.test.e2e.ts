export {}

describe('Create dataset page', () => {
  describe('when unauthenticated', () => {
    beforeEach(() => {
      cy.visit('/dataset/new')
    })

    it('should redirect to home page', () => {
      cy.location('pathname').should('equal', '/')
    })
  })

  describe('when authorized as contributor', () => {
    beforeEach(() => {
      cy.request('POST', 'http://localhost:8080/api/auth/sign-in', {
        username: 'Contributor',
        password: 'q1w2e3r4t5',
      }).then((response) => {
        cy.window().then((window) => {
          const token = response.headers['authorization']
          if (typeof token === 'string') {
            window.localStorage.setItem('__sshoc_token__', token)
          }
        })
      })
      cy.visit('/dataset/new')
    })

    it('should set document title', () => {
      cy.title().should('contain', 'Create Dataset')
    })

    it('should display page title', () => {
      cy.get('h1').contains('Create Dataset')
    })

    it('should display field error messages when required fields are empty on submit', () => {
      cy.findByRole('button', { name: 'Submit' }).click()
      cy.findAllByText('Field must not be empty.').should('have.length', 2)
      cy.get('input[name="label"]').should('have.attr', 'aria-invalid', 'true').focused()
    })

    it.only('should submit form when required fields are not empty on submit, and redirect to success page', () => {
      cy.get('input[name="label"').type('The label')
      cy.get('textarea[name="description"]').type('The description')
      cy.findByRole('button', { name: 'Submit' }).click()
      cy.findByRole('status').contains('Successfully')
      cy.location('pathname').should('equal', '/success')
    })
  })
})
