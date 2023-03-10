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
      })
      cy.visit('/dataset/new')
    })

    it('should set document title', () => {
      cy.title().should('contain', 'Create Dataset')
    })

    it('should display page title', () => {
      cy.get('h1').contains('Create Dataset')
    })

    it('should redirect to accoun screen on cancel', () => {
      cy.findByRole('button', { name: 'Cancel' }).realClick()
      cy.location('pathname').should('equal', '/account')
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

    it('should dispatch filled out form as payload on submit', () => {
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
      cy.get('input[name="dateCreated"]').type('2022-01-01')
      cy.get('input[name="dateLastUpdated"]').type('2022-02-02')
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
      cy.get('input[name="properties[4].value"]').type('http://see-also.com')
      cy.get('input[name="properties[5].concept.uri"]').type('{downarrow}{downarrow}{enter}')
      cy.get('input[name="properties[6].value"]').type('2022')

      cy.intercept({ pathname: '/api/datasets', method: 'POST' }).as('create-dataset')

      cy.findByRole('button', { name: 'Submit' }).realClick()
      cy.findByRole('status').contains('Successfully suggested new Dataset.')
      cy.location('pathname').should('equal', '/success')

      cy.wait('@create-dataset').then((interception) => {
        assert.deepEqual(interception.request.body, {
          label: 'The label',
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
              value: '123',
            },
            {
              type: { code: 'language', type: 'concept' },
              concept: { uri: 'http://iso639-3.sil.org/code/eng' },
            },
            {
              type: { code: 'object-format', type: 'concept' },
              concept: { uri: 'http://www.iana.org/assignments/media-types/image/tiff' },
            },
            {
              type: { code: 'see-also', type: 'url' },
              value: 'http://see-also.com',
            },
            {
              type: { code: 'license', type: 'concept' },
              concept: { uri: 'http://spdx.org/licenses/Entessa' },
            },
            {
              type: { code: 'year', type: 'int' },
              value: '2022',
            },
          ],
          externalIds: [
            { identifier: 'abcdef', identifierService: { code: 'Wikidata' } },
            { identifier: '123', identifierService: { code: 'GitHub' } },
          ],
          relatedItems: [],
          dateCreated: '2022-01-01T00:00:00.000Z',
          dateLastUpdated: '2022-02-02T00:00:00.000Z',
        })
      })
    })

    it('should dispatch filled out form as draft payload when saving as draft', () => {
      cy.get('input[name="label"]').type('The label')
      cy.get('input[name="version"]').type('2.0')
      cy.get('textarea[name="description"]').type('The description')
      cy.get('input[name="accessibleAt[0]"]').type('https://first.com')
      cy.findByRole('button', { name: 'Add Accessible at URL' }).click()
      cy.get('input[name="accessibleAt[1]"]').type('https://second.com')
      // FIXME: backend throws 500 when updating external ids
      // @see https://gitlab.gwdg.de/sshoc/sshoc-marketplace-backend/-/issues/166
      // cy.findByRole('button', { name: 'ID Service Please select an option' }).click()
      // cy.findByRole('option', { name: 'Wikidata' }).click({ force: true })
      // cy.get('input[name="externalIds[0].identifier"]').type('abcdef')
      // cy.findByRole('button', { name: 'Add External ID' }).click()
      // cy.findByRole('button', { name: 'ID Service Please select an option' }).click()
      // cy.findByRole('option', { name: 'GitHub' }).click({ force: true })
      // cy.get('input[name="externalIds[1].identifier"]').type('123')
      cy.get('input[name="dateCreated"]').type('2022-01-01')
      cy.get('input[name="dateLastUpdated"]').type('2022-02-02')
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
      cy.get('input[name="properties[4].value"]').type('http://see-also.com')
      cy.get('input[name="properties[5].concept.uri"]').type('{downarrow}{downarrow}{enter}')
      cy.get('input[name="properties[6].value"]').type('2022')

      cy.intercept({ pathname: '/api/datasets', query: { draft: 'true' }, method: 'POST' }).as(
        'create-draft-dataset',
      )

      cy.findByRole('button', { name: 'Save as draft' }).realClick()
      cy.findByRole('status').contains('Successfully saved Dataset draft.')
      cy.location('pathname').should('equal', '/dataset/new')

      cy.wait('@create-draft-dataset').then((interception) => {
        assert.deepEqual(interception.request.body, {
          label: 'The label',
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
              value: '123',
            },
            {
              type: { code: 'language', type: 'concept' },
              concept: { uri: 'http://iso639-3.sil.org/code/eng' },
            },
            {
              type: { code: 'object-format', type: 'concept' },
              concept: { uri: 'http://www.iana.org/assignments/media-types/image/tiff' },
            },
            {
              type: { code: 'see-also', type: 'url' },
              value: 'http://see-also.com',
            },
            {
              type: { code: 'license', type: 'concept' },
              concept: { uri: 'http://spdx.org/licenses/Entessa' },
            },
            {
              type: { code: 'year', type: 'int' },
              value: '2022',
            },
          ],
          // FIXME: backend throws 500 when updating external ids:
          // @see https://gitlab.gwdg.de/sshoc/sshoc-marketplace-backend/-/issues/166
          externalIds: [],
          // externalIds: [
          //   { identifier: 'abcdef', identifierService: { code: 'Wikidata' } },
          //   { identifier: '123', identifierService: { code: 'GitHub' } },
          // ],
          relatedItems: [],
          dateCreated: '2022-01-01T00:00:00.000Z',
          dateLastUpdated: '2022-02-02T00:00:00.000Z',
        })
      })

      cy.intercept({ pathname: '/api/datasets/*', query: { draft: 'true' }, method: 'PUT' }).as(
        'update-draft-dataset',
      )

      cy.get('input[name="label"]').clear().type('The updated label')
      cy.findByRole('button', { name: 'Save as draft' }).realClick()
      cy.findAllByRole('status').last().contains('Successfully saved Dataset draft.')
      cy.location('pathname').should('equal', '/dataset/new')
      cy.wait('@update-draft-dataset').then((interception) => {
        assert.equal(interception.request.body.label, 'The updated label')
      })

      cy.findAllByRole('button', { name: 'Remove Property' }).first().realClick()
      cy.findAllByRole('button', { name: 'Add Property' }).realClick()
      cy.findByRole('button', { name: 'Property type Please select an option' }).click()
      cy.findByRole('option', { name: 'Activity' }).click({ force: true })
      cy.get('input[name="properties[6].concept.uri"]').type('{downarrow}{downarrow}{enter}')

      cy.intercept({ pathname: '/api/datasets/*/commit', method: 'POST' }).as(
        'commit-draft-dataset',
      )

      cy.findByRole('button', { name: 'Submit' }).realClick()
      cy.findAllByRole('status').last().contains('Successfully suggested new Dataset.')
      cy.location('pathname').should('equal', '/success')

      cy.wait('@update-draft-dataset').then((interception) => {
        assert.deepEqual(interception.request.body, {
          label: 'The updated label',
          version: '2.0',
          description: 'The description',
          accessibleAt: ['https://first.com', 'https://second.com'],
          contributors: [
            { actor: { id: 1 }, role: { code: 'contributor' } },
            { actor: { id: 2 }, role: { code: 'contact' } },
          ],
          properties: [
            {
              type: { code: 'keyword', type: 'string' },
              value: '123',
            },
            {
              type: { code: 'language', type: 'concept' },
              concept: { uri: 'http://iso639-3.sil.org/code/eng' },
            },
            {
              type: { code: 'object-format', type: 'concept' },
              concept: { uri: 'http://www.iana.org/assignments/media-types/image/tiff' },
            },
            {
              type: { code: 'see-also', type: 'url' },
              value: 'http://see-also.com',
            },
            {
              type: { code: 'license', type: 'concept' },
              concept: { uri: 'http://spdx.org/licenses/Entessa' },
            },
            {
              type: { code: 'year', type: 'int' },
              value: '2022',
            },
            {
              type: { code: 'activity', type: 'concept' },
              concept: {
                uri: 'http://dcu.gr/ontologies/scholarlyontology/instances/ActivityType-Collecting',
              },
            },
          ],
          // FIXME: backend throws 500 when updating external ids:
          // @see https://gitlab.gwdg.de/sshoc/sshoc-marketplace-backend/-/issues/166
          externalIds: [],
          // externalIds: [
          //   { identifier: 'abcdef', identifierService: { code: 'Wikidata' } },
          //   { identifier: '123', identifierService: { code: 'GitHub' } },
          // ],
          relatedItems: [],
          dateCreated: '2022-01-01T00:00:00.000Z',
          dateLastUpdated: '2022-02-02T00:00:00.000Z',
        })
      })
      cy.wait('@commit-draft-dataset')
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
      cy.visit('/dataset/new')
    })

    it('should submit form when required fields are not empty on submit, and redirect to item detail page', () => {
      cy.get('input[name="label"').focus().type('The label').blur()
      cy.get('textarea[name="description"]').focus().type('The description').blur()
      cy.findByRole('button', { name: 'Publish' }).realClick()
      cy.findByRole('status').contains('Successfully created new Dataset.')
      cy.location('pathname').should('have.string', '/dataset')
    })
  })
})
