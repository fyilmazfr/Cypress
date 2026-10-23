describe('Test fonctionnel - Panier', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4200');

    // Connexion utilisateur
    cy.contains('Connexion').click();
    cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
    cy.get('[data-cy="login-input-password"]').type('testtest');
    cy.get('[data-cy="login-submit"]').click();

    // Aller sur la liste des produits
    cy.get('.text-header > button').click();
    cy.url().should('include', '/products');

    // Ouvrir une fiche produit
    cy.get('[data-cy="product-link"]').eq(2).click();

    cy.get('[data-cy="detail-product-stock"]').should('be.visible');
    cy.get('[data-cy="detail-product-quantity"]').should('be.visible');
    cy.get('[data-cy="detail-product-add"]').should('be.visible');
  });

  it('Ajout d’un produit au panier avec une quantité valide', () => {
    cy.get('[data-cy="detail-product-quantity"]')
      .clear()
      .type('1')
      .blur();

    cy.get('[data-cy="detail-product-add"]')
      .scrollIntoView()
      .click({ force: true });

    cy.url().should('include', '/cart');
  });

  it('Refus d’une quantité négative', () => {
    cy.get('[data-cy="detail-product-quantity"]')
      .clear()
      .type('-5')
      .blur();

    // Comportement attendu :
    // une valeur négative ne doit pas être conservée
    cy.get('[data-cy="detail-product-quantity"]')
      .invoke('val')
      .then((value) => {
        expect(value).to.not.equal('-5');
      });

    // Le bouton ne doit pas permettre l’ajout
    cy.get('[data-cy="detail-product-add"]').should('be.disabled');
  });

  it('Refus d’une quantité supérieure à 20', () => {
    cy.get('[data-cy="detail-product-quantity"]')
      .clear()
      .type('21')
      .blur();

    // Comportement attendu :
    // une valeur supérieure à 20 ne doit pas être conservée
    cy.get('[data-cy="detail-product-quantity"]')
      .invoke('val')
      .then((value) => {
        expect(Number(value)).to.be.at.most(20);
      });

    // Le bouton ne doit pas permettre l’ajout
    cy.get('[data-cy="detail-product-add"]').should('be.disabled');
  });

});