describe('Test fonctionnel - Connexion', () => {

    it('Connexion avec un utilisateur valide', () => {

        cy.visit('http://localhost:4200')
        cy.contains('Connexion').click()

        cy.get('[data-cy="login-input-username"]').type('test2@test.fr')
        cy.get('[data-cy="login-input-password"]').type('testtest')

        cy.get('[data-cy="login-submit"]').click()
        cy.get('[data-cy="nav-link-cart"]').should('be.visible') //mon panier
    })
})