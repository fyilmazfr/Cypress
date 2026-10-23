describe('Smoke tests', () => {
    const baseUrl = 'http://localhost:4200';

  
  it('Afficher les champs et le bouton de connexion', () => {
      cy.visit(baseUrl)

    cy.contains('Connexion').click()

    cy.get('[data-cy="login-input-username"]').should('be.visible')
    cy.get('[data-cy="login-input-password"]').should('be.visible')
    cy.get('[data-cy="login-submit"]').should('be.visible')
  })



  it('Afficher le bouton d’ajout au panier sur la fiche produit après connexion', () => {
     cy.visit(baseUrl)

    cy.contains('Connexion').click()
    cy.get('[data-cy="login-input-username"]').type('test2@test.fr')
    cy.get('[data-cy="login-input-password"]').type('testtest')
    cy.get('[data-cy="login-submit"]').click()

    cy.get('.text-header > button').click()
    cy.get('[data-cy="product-link"]').first().click()

    cy.get('[data-cy="detail-product-add"]')
      .scrollIntoView()
      .should('be.visible')
      .and('not.be.disabled')
  })

  it('Afficher le champ de disponibilité (stock) sur la fiche produit', () => {
    cy.visit(baseUrl)

    cy.get('.text-header > button').click()
    cy.get('[data-cy="product-link"]').first().click()

    cy.get('[data-cy="detail-product-stock"]')
      .should('be.visible')
      .and('contain', 'en stock')
  })
})