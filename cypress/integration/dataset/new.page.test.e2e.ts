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

  describe('when authenticated as contributor', () => {
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
        cy.visit('/dataset/new')
      })
    })

    it('should set document title', () => {
      cy.title().should('contain', 'Create Dataset')
    })

    it('should display page title', () => {
      cy.get('h1').contains('Create Dataset')
    })

    it('should not submit form when required fields are empty on submit', () => {
      cy.findByRole('button', { name: 'Submit' }).realClick()
      cy.findAllByText('Field must not be empty.').should('have.length', 2)
      cy.get('input[name="label"]').should('have.attr', 'aria-invalid', 'true').focused()
    })

    it('should submit form when required fields are not empty on submit, and redirect to success page', () => {
      cy.get('input[name="label"').focus().type('The label').blur()
      cy.get('textarea[name="description"]').focus().type('The description').blur()
      cy.findByRole('button', { name: 'Submit' }).realClick()
      cy.findByRole('status').contains('Successfully suggested new Dataset.')
      cy.location('pathname').should('equal', '/success')
    })

    it('should display field error message when "accessible at" field is empty', () => {
      cy.get('input[name="accessibleAt[0]"').focus().blur()
      cy.findByText('Field must not be empty.').should('be.visible')
      cy.get('input[name="accessibleAt[0]"]').should('have.attr', 'aria-invalid', 'true')
    })

    it('should display field error message when "accessible at" field has invalid url', () => {
      cy.get('input[name="accessibleAt[0]"').focus().type('invalid-url').blur()
      cy.findByText('Please provide a valid URL.').should('be.visible')
      cy.get('input[name="accessibleAt[0]"]').should('have.attr', 'aria-invalid', 'true')
    })

    it('should display field error message when "external id" fields are empty', () => {
      cy.findByLabelText('ID Service', { selector: 'button' }).focus().blur()
      cy.findByLabelText('Identifier').focus().blur()
      cy.findAllByText('Field must not be empty.').should('have.length', 2)
      // cy.get('select[name="externalIds[0].identifierService.code"]').should(
      //   'have.attr',
      //   'aria-invalid',
      //   'true',
      // )
      cy.get('input[name="externalIds[0].identifier"]').should('have.attr', 'aria-invalid', 'true')
    })

    it('should display field error message when "contributor" fields are empty', () => {
      cy.findByLabelText('Role', { selector: 'button' }).focus().blur()
      cy.get('input[name="contributors[0].actor.id"]').focus().blur()
      cy.findAllByText('Field must not be empty.').should('have.length', 2)
      // cy.get('select[name="contributors[0].role.code"]').should('have.attr', 'aria-invalid', 'true')
      cy.get('input[name="contributors[0].actor.id"]').should('have.attr', 'aria-invalid', 'true')
    })

    it('should display field error message when "related item" fields are empty', () => {
      cy.findByLabelText('Relation type', { selector: 'button' }).focus().blur()
      cy.get('input[name="relatedItems[0].persistentId"]').focus().blur()
      cy.findAllByText('Field must not be empty.').should('have.length', 2)
      // cy.get('select[name="relatedItems[0].relation.code"]').should(
      //   'have.attr',
      //   'aria-invalid',
      //   'true',
      // )
      cy.get('input[name="relatedItems[0].persistentId"]').should(
        'have.attr',
        'aria-invalid',
        'true',
      )
    })

    it.only('should dispatch filled out form as payload on submit', () => {
      cy.get('input[name="label"]').type('The label')
      cy.get('input[name="version"]').type('2.0')
      cy.get('textarea[name="description"]').type('The description')
      cy.get('input[name="accessibleAt[0]"]').type('https://first.com')
      cy.findByRole('button', { name: 'Add Accessible at URL' }).click()
      cy.get('input[name="accessibleAt[1]"]').type('https://second.com')
      cy.findByRole('button', { name: 'ID Service Please select an option' }).click()
      cy.findByRole('option', { name: 'Wikidata' }).click({ force: true })
      cy.get('input[name="externalIds[0].identifier"]').type('abcdef')
      cy.findByRole('button', { name: 'Add External ID' }).click()
      cy.findByRole('button', { name: 'ID Service Please select an option' }).click()
      cy.findByRole('option', { name: 'GitHub' }).click({ force: true })
      cy.get('input[name="externalIds[1].identifier"]').type('123')
      cy.get('input[name="dateCreated"]').then((el) => {
        return el.val('2022-01-01')
      })
      cy.get('input[name="dateLastUpdated"]').then((el) => {
        return el.val('2022-02-02')
      })
      cy.findByRole('button', { name: 'Role Please select an option' }).click()
      cy.findByRole('option', { name: 'Contributor' }).click({ force: true })
      cy.findByRole('combobox', { name: 'Name' }).type('{downarrow}{downarrow}{enter}')
      cy.findByRole('button', { name: 'Add Actor' }).click()
      cy.findByRole('button', { name: 'Role Please select an option' }).click()
      cy.findByRole('option', { name: 'Contact' }).click({ force: true })
      cy.findAllByRole('combobox', { name: 'Name' })
        .last()
        .type('{downarrow}{downarrow}{downarrow}{enter}')
      // cy.findAllByRole('combobox', { name: 'Concept' })
      //   .first()
      //   .type('{downarrow}{downarrow}{enter}')
      cy.get('input[name="properties[0].concept.uri"]').type('{downarrow}{downarrow}{enter}')
      cy.get('input[name="properties[1].value"]').type('123')
      cy.get('input[name="properties[2].concept.uri"]').type('{downarrow}{downarrow}{enter}')
      cy.get('input[name="properties[3].concept.uri"]').type('{downarrow}{downarrow}{enter}')
      cy.get('input[name="properties[4].value"]').type('456')
      cy.get('input[name="properties[5].concept.uri"]').type('{downarrow}{downarrow}{enter}')
      cy.get('input[name="properties[6].value"]').type('2022')
    })
  })
})
