export {}

describe('Form field validation error messages', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:8080/api/auth/sign-in', {
      username: 'Administrator',
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

  it('should display field error message when "accessible at" field is empty', () => {
    cy.get('input[name="accessibleAt[0]"]').focus().blur()
    cy.findByText('Field must not be empty.').should('be.visible')
    cy.get('input[name="accessibleAt[0]"]').should('have.attr', 'aria-invalid', 'true')
  })

  it('should display field error message when "accessible at" field has invalid url', () => {
    cy.get('input[name="accessibleAt[0]"]').focus().type('invalid-url').blur()
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
    cy.get('input[name="relatedItems[0].persistentId"]').should('have.attr', 'aria-invalid', 'true')
  })

  it('should display form submit errors', () => {
    // client-side we e.g. don't check for duplicate external id entries, so this will produce
    // a validation error server-side.
    cy.get('input[name="label"]').type('The label')
    cy.get('textarea[name="description"]').type('The description')
    cy.findByRole('button', { name: 'ID Service Please select an option' }).click()
    cy.findByRole('option', { name: 'GitHub' }).click({ force: true })
    cy.get('input[name="externalIds[0].identifier"]').type('123')
    cy.findByRole('button', { name: 'Add External ID' }).click()
    cy.findByRole('button', { name: 'ID Service Please select an option' }).click()
    cy.findByRole('option', { name: 'GitHub' }).click({ force: true })
    cy.get('input[name="externalIds[1].identifier"]').type('123')

    cy.findByRole('button', { name: 'Publish' }).realClick()
    cy.contains("Last submission failed: Duplicate item's external id: 123 (from: GitHub)")
  })

  it('should display field error message when property value has invalid type', () => {
    cy.window().then((window) => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/api/property-types',
        headers: { authorization: window.localStorage.getItem('__sshoc_token__') },
        body: {
          label: '_Test int',
          code: '_test-int',
          type: 'int',
        },
        failOnStatusCode: false,
      })
    })
    cy.window().then((window) => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/api/property-types',
        headers: { authorization: window.localStorage.getItem('__sshoc_token__') },
        body: {
          label: '_Test float',
          code: '_test-float',
          type: 'float',
        },
        failOnStatusCode: false,
      })
    })
    cy.window().then((window) => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/api/property-types',
        headers: { authorization: window.localStorage.getItem('__sshoc_token__') },
        body: {
          label: '_Test date',
          code: '_test-date',
          type: 'date',
        },
        failOnStatusCode: false,
      })
    })
    cy.window().then((window) => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/api/property-types',
        headers: { authorization: window.localStorage.getItem('__sshoc_token__') },
        body: {
          label: '_Test boolean',
          code: '_test-boolean',
          type: 'boolean',
        },
        failOnStatusCode: false,
      })
    })
    cy.window().then((window) => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/api/property-types',
        headers: { authorization: window.localStorage.getItem('__sshoc_token__') },
        body: {
          label: '_Test url',
          code: '_test-url',
          type: 'url',
        },
        failOnStatusCode: false,
      })
    })

    cy.findByRole('button', { name: 'Add Property' }).realClick()
    cy.findByRole('button', { name: 'Property type Please select an option' }).click()
    cy.findByRole('option', { name: '_Test int' }).click({ force: true })
    cy.get('input[name="properties[7].value"]').type('abc')

    cy.findByRole('button', { name: 'Add Property' }).realClick()
    cy.findByRole('button', { name: 'Property type Please select an option' }).click()
    cy.findByRole('option', { name: '_Test float' }).click({ force: true })
    cy.get('input[name="properties[8].value"]').type('abc')

    cy.findByRole('button', { name: 'Add Property' }).realClick()
    cy.findByRole('button', { name: 'Property type Please select an option' }).click()
    cy.findByRole('option', { name: '_Test date' }).click({ force: true })
    cy.get('input[name="properties[9].value"]').type('abc')

    cy.findByRole('button', { name: 'Add Property' }).realClick()
    cy.findByRole('button', { name: 'Property type Please select an option' }).click()
    cy.findByRole('option', { name: '_Test boolean' }).click({ force: true })
    cy.get('input[name="properties[10].value"]').type('123')

    cy.findByRole('button', { name: 'Add Property' }).realClick()
    cy.findByRole('button', { name: 'Property type Please select an option' }).click()
    cy.findByRole('option', { name: '_Test url' }).click({ force: true })
    cy.get('input[name="properties[11].value"]').type('123')

    cy.findByRole('button', { name: 'Add Property' }).realClick()
    cy.get('[data-validation-state="invalid"]').contains('Invalid value. Expected: Number.')
    cy.get('[data-validation-state="invalid"]').contains('Invalid value. Expected: Date.')
    cy.get('[data-validation-state="invalid"]').contains('Invalid value. Expected: true or false.')
    cy.get('[data-validation-state="invalid"]').contains('Invalid value. Expected: URL.')

    cy.get('input[name="properties[7].value"]').clear().type('123')
    cy.get('input[name="properties[8].value"]').clear().type('123')
    cy.get('input[name="properties[9].value"]').clear().type('2022-01-01')
    cy.get('input[name="properties[10].value"]').clear().type('TRUE')
    cy.get('input[name="properties[11].value"]').clear().type('http://example.com')

    cy.get('input[name="label"]').type('The label')
    cy.get('textarea[name="description"]').type('The description')
    cy.findByRole('button', { name: 'Publish' }).realClick()
    cy.findByRole('status').contains('Successfully created new Dataset.')
    cy.location('pathname').should('have.string', '/dataset')
  })
})
