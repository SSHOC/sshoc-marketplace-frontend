export {}

describe('Create workflow page', () => {
  describe('when unauthenticated', () => {
    beforeEach(() => {
      cy.visit('/workflow/new')
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
      })
      cy.visit('/workflow/new')
    })

    it('should set document title', () => {
      cy.title().should('contain', 'Create Workflow')
    })

    it('should display page title', () => {
      cy.get('h1').contains('Create Workflow')
    })

    it('should redirect to accoun screen on cancel', () => {
      cy.findByRole('button', { name: 'Cancel' }).realClick()
      cy.location('pathname').should('equal', '/account')
    })

    it('should not allow going to next page (steps) when workflow has empty required fields', () => {
      cy.findByRole('button', { name: 'Next' }).realClick()
      cy.findAllByText('Field must not be empty.').should('have.length', 2)
      cy.get('input[name="label"]').should('have.attr', 'aria-invalid', 'true').focused()
    })

    it('should go to next page (steps) when workflow has values in required fields', () => {
      cy.get('input[name="label"]').type('The workflow')
      cy.get('textarea[name="description"]').type('The description')
      cy.findByRole('button', { name: 'Next' }).realClick()
      cy.get('h1').contains('Create Workflow steps')
    })

    it('should go back to workflow from workflow steps view via button', () => {
      cy.get('input[name="label"]').type('The workflow')
      cy.get('textarea[name="description"]').type('The description')
      cy.findByRole('button', { name: 'Next' }).realClick()
      cy.findByRole('button', { name: 'Workflow' }).realClick()
      cy.get('h1').should('have.text', 'Create Workflow')
      cy.get('input[name="label"]').clear()
      cy.findByRole('button', { name: 'Workflow steps' }).realClick()
      cy.get('h1').should('have.text', 'Create Workflow')
      cy.get('input[name="label"]').type('The workflow')
      cy.findByRole('button', { name: 'Workflow steps' }).realClick()
      cy.get('h1').should('have.text', 'Create Workflow steps')
    })

    it('should submit minimal workflow', () => {
      cy.get('input[name="label"]').type('The workflow')
      cy.get('textarea[name="description"]').type('The description')
      cy.findByRole('button', { name: 'Next' }).realClick()
      cy.findByRole('button', { name: 'Add step' }).realClick()
      cy.get('input[name="composedOf[0].label"]').type('The first step')
      cy.get('textarea[name="composedOf[0].description"]').type('The description')
      cy.findByRole('button', { name: 'Relation type Please select an option' }).click()
      cy.findByRole('option', { name: 'Relates to' }).click({ force: true })
      cy.findByRole('combobox', { name: 'Related item' }).type('{downarrow}{downarrow}{enter}')
      cy.findByRole('button', { name: 'Add Related item' }).click()
      cy.findByRole('button', { name: 'Relation type Please select an option' }).click()
      cy.findByRole('option', { name: 'Relates to' }).click({ force: true })
      cy.findByRole('button', { name: 'Save' }).realClick()

      cy.intercept({ method: 'POST', pathname: '/api/workflows' }).as('create-workflow')
      cy.intercept({ method: 'POST', pathname: '/api/workflows/*/steps' }).as(
        'create-workflow-step',
      )

      cy.findByRole('button', { name: 'Submit' }).realClick()
      cy.findByRole('status').contains('Successfully suggested new Workflow.')
      cy.location('pathname').should('equal', '/success')
      cy.wait('@create-workflow').then((interception) => {
        assert.deepEqual(interception.request.body, {
          label: 'The workflow',
          description: 'The description',
          accessibleAt: [],
          contributors: [],
          externalIds: [],
          properties: [],
          relatedItems: [],
        })
      })
      cy.wait('@create-workflow-step').then((interception) => {
        assert.deepEqual(interception.request.body, {
          label: 'The first step',
          description: 'The description',
          relatedItems: [{ persistentId: 'ArOAJD', relation: { code: 'relates-to' } }],
          stepNo: 1,
        })
      })
    })

    it('should submit workflow with recommended fields and added steps', () => {
      cy.get('input[name="label"]').type('The workflow')
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
      cy.findByRole('button', { name: 'Role Please select an option' }).click()
      cy.findByRole('option', { name: 'Contributor' }).click({ force: true })
      cy.findByRole('combobox', { name: 'Name' }).type('{downarrow}{downarrow}{enter}')
      cy.findByRole('button', { name: 'Add Actor' }).click()
      cy.findByRole('button', { name: 'Role Please select an option' }).click()
      cy.findByRole('option', { name: 'Contact' }).click({ force: true })
      cy.findAllByRole('combobox', { name: 'Name' })
        .last()
        .type('{downarrow}{downarrow}{downarrow}{enter}')
      cy.get('input[name="properties[0].concept.uri"]').type('{downarrow}{downarrow}{enter}')
      cy.get('input[name="properties[1].value"]').type('some keyword')
      cy.get('input[name="properties[2].concept.uri"]').type('{downarrow}{downarrow}{enter}')
      cy.get('input[name="properties[3].value"]').type('http://see-also.com')
      cy.get('input[name="properties[4].concept.uri"]').type('{downarrow}{downarrow}{enter}')
      cy.findByRole('button', { name: 'Relation type Please select an option' }).click()
      cy.findByRole('option', { name: 'Relates to' }).click({ force: true })
      cy.findByRole('combobox', { name: 'Related item' }).type('{downarrow}{downarrow}{enter}')
      cy.findByRole('button', { name: 'Add Related item' }).click()
      cy.findByRole('button', { name: 'Relation type Please select an option' }).click()
      cy.findByRole('option', { name: 'Relates to' }).click({ force: true })
      cy.findAllByRole('combobox', { name: 'Related item' })
        .last()
        .type('{downarrow}{downarrow}{downarrow}{enter}')

      cy.findByRole('button', { name: 'Next' }).realClick()

      cy.findByRole('button', { name: 'Add step' }).realClick()
      cy.get('input[name="composedOf[0].label"]').type('The first step')
      cy.get('textarea[name="composedOf[0].description"]').type('The description')
      cy.findByRole('button', { name: 'Save' }).realClick()

      cy.findByRole('button', { name: 'Add step' }).realClick()
      cy.get('input[name="composedOf[1].label"]').type('The second step')
      cy.get('textarea[name="composedOf[1].description"]').type('The description')
      cy.findByRole('button', { name: 'Save' }).realClick()

      cy.findByRole('button', { name: 'Move down' }).realClick()
      cy.findByRole('button', { name: 'Move down' }).realClick()
      cy.findByRole('button', { name: 'Move down' }).realClick()

      cy.findByRole('button', { name: 'Edit step 1' }).realClick()
      cy.get('input[name="composedOf[0].label"]').clear().type('The edited step')
      cy.findByRole('button', { name: 'Save' }).realClick()

      cy.intercept({ method: 'POST', pathname: '/api/workflows' }).as('create-workflow')
      cy.intercept({ method: 'POST', pathname: '/api/workflows/*/steps' }).as(
        'create-workflow-step',
      )
      cy.findByRole('button', { name: 'Submit' }).realClick()
      cy.findByRole('status').contains('Successfully suggested new Workflow.')
      cy.location('pathname').should('equal', '/success')
      cy.wait('@create-workflow').then((interception) => {
        assert.deepEqual(interception.request.body, {
          label: 'The workflow',
          version: '2.0',
          description: 'The description',
          accessibleAt: ['https://first.com', 'https://second.com'],
          contributors: [
            { actor: { id: 1 }, role: { code: 'contributor' } },
            { actor: { id: 2 }, role: { code: 'contact' } },
          ],
          properties: [
            {
              type: { code: 'activity', type: 'concept' },
              concept: {
                uri: 'http://dcu.gr/ontologies/scholarlyontology/instances/ActivityType-Collecting',
              },
            },
            {
              type: { code: 'keyword', type: 'string' },
              value: 'some keyword',
            },
            {
              type: { code: 'language', type: 'concept' },
              concept: { uri: 'http://iso639-3.sil.org/code/eng' },
            },
            {
              type: { code: 'see-also', type: 'url' },
              value: 'http://see-also.com',
            },
            {
              type: { code: 'license', type: 'concept' },
              concept: { uri: 'http://spdx.org/licenses/Entessa' },
            },
          ],
          externalIds: [
            { identifier: 'abcdef', identifierService: { code: 'Wikidata' } },
            { identifier: '123', identifierService: { code: 'GitHub' } },
          ],
          relatedItems: [
            { persistentId: 'FPwtaA', relation: { code: 'relates-to' } },
            { persistentId: 'ArOAJD', relation: { code: 'relates-to' } },
          ],
        })
      })
      cy.wait('@create-workflow-step').then((interception) => {
        assert.deepEqual(interception.request.body, {
          label: 'The edited step',
          description: 'The description',
          relatedItems: [],
          stepNo: 1,
        })
      })
      cy.wait('@create-workflow-step').then((interception) => {
        assert.deepEqual(interception.request.body, {
          label: 'The first step',
          description: 'The description',
          relatedItems: [],
          stepNo: 2,
        })
      })
    })

    it.only('should dispatch filled out form as draft payload when saving as draft', () => {
      // TODO:
    })
  })

  describe('when authenticated as administrator', () => {
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
      cy.visit('/workflow/new')
    })

    it('should submit form when required fields are not empty on submit, and redirect to item detail page', () => {
      cy.get('input[name="label"').focus().type('The label').blur()
      cy.get('textarea[name="description"]').focus().type('The description').blur()
      cy.findByRole('button', { name: 'Next' }).realClick()
      cy.findByRole('button', { name: 'Publish' }).realClick()
      cy.findByRole('status').contains('Successfully created new Workflow.')
      cy.location('pathname').should('have.string', '/workflow')
    })
  })
})
