describe('Test de sécurité - XSS', () => {
  it("Refuser un script XSS dans les commentaires", () => {

    cy.request('POST', 'http://localhost:8081/login', {
      username: 'test2@test.fr',
      password: 'testtest'
    }).then((loginResponse) => {

      let token = loginResponse.body.token

      cy.request({
        method: 'POST',
        url: 'http://localhost:8081/reviews',
        headers: {
          Authorization: `Bearer ${token}`
        },
        failOnStatusCode: false,
        body: {
          title: 'Test XSS',
          comment: '<script>alert("XSS");</script>',
          rating: 4
        }
      }).then((response) => {

        // Le comportement attendu est un refus
        expect(response.status).to.eq(400)

      })
    })
  })

  it("Ne pas exécuter de script saisi dans l'espace commentaire (front)", () => {
    const alertStub = cy.stub()
    cy.on('window:alert', alertStub)

    cy.visit('http://localhost:4200')
    cy.contains('Connexion').click()
    cy.get('[data-cy="login-input-username"]').type('test2@test.fr')
    cy.get('[data-cy="login-input-password"]').type('testtest')
    cy.get('[data-cy="login-submit"]').click()
    cy.get('[data-cy="nav-link-cart"]').should('be.visible')

    cy.get('[data-cy="nav-link-reviews"]').click()
    cy.get('[data-cy="review-input-rating-images"] img').eq(3).click()
    cy.get('[data-cy="review-input-title"]').type('Test XSS front')
    cy.get('[data-cy="review-input-comment"]').type('<img src=x onerror=alert("XSS")>')
    cy.get('[data-cy="review-submit"]').click()

    // Le script ne doit jamais s'exécuter à l'affichage des avis
    cy.contains('[data-cy="review-title"]', 'Test XSS front').should('exist')
    cy.wrap(alertStub).should('not.have.been.called')
  })
})