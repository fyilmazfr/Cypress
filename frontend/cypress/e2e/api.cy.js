describe('Tests API - Eco Bliss Bath', () => {
  const baseUrlApi = 'http://localhost:8081';

  it('POST /login - Utilisateur connu (200)', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrlApi}/login`,
      body: {
        username: 'test2@test.fr',
        password: 'testtest'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('POST /login - Utilisateur inconnu (401)', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrlApi}/login`,
      body: {
        username: 'inconnu@test.fr',
        password: 'wrongpassword'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('GET /orders - Recuperer les articles du panier sans etre connecte (401)', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrlApi}/orders`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('GET /orders - Recuperer les articles du panier en etant connecte', () => {
    cy.login('test2@test.fr', 'testtest').then((token) => {
      cy.request({
        method: 'GET',
        url: `${baseUrlApi}/orders`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  it('GET /products - Recuperer la liste des produits', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrlApi}/products`
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.empty;
    });
  });

  it('GET /products/{id} - Recuperer le detail d un produit avec un id fixe', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrlApi}/products/3`
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id');
    });
  });

  it('GET /products/{id} - Recuperer le detail d un produit avec un id dynamique', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrlApi}/products`
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.empty;

      const productId = response.body[0].id;

      cy.request({
        method: 'GET',
        url: `${baseUrlApi}/products/${productId}`
      }).then((detailResponse) => {
        expect(detailResponse.status).to.eq(200);
        expect(detailResponse.body).to.have.property('id', productId);
      });
    });
  });

  it('PUT /orders/add - Ajouter un produit au panier (Correction du Bug POST/PUT)', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrlApi}/login`,
      body: {
        username: 'test2@test.fr',
        password: 'testtest'
      }
    }).then((loginResponse) => {
      expect(loginResponse.status).to.eq(200);

      const token = loginResponse.body.token;

      cy.request({
        method: 'GET',
        url: `${baseUrlApi}/products`
      }).then((productsResponse) => {
        expect(productsResponse.status).to.eq(200);
        expect(productsResponse.body).to.not.be.empty;

        const product = productsResponse.body.find((item) => item.availableStock > 0);
        expect(product).to.exist;

        cy.request({
          method: 'PUT',
          url: `${baseUrlApi}/orders/add`,
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: {
            product: product.id,
            quantity: 1
          }
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });
  });

  it('PUT /orders/add - Ajouter un produit en rupture de stock (refus attendu)', () => {
    cy.login('test2@test.fr', 'testtest').then((token) => {
      cy.request(`${baseUrlApi}/products`).then((productsResponse) => {
        const product = productsResponse.body.find((item) => item.availableStock <= 0);
        expect(product, 'produit en rupture de stock').to.exist;

        cy.request({
          method: 'PUT',
          url: `${baseUrlApi}/orders/add`,
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: {
            product: product.id,
            quantity: 1
          },
          failOnStatusCode: false
        }).then((response) => {
          // Un produit sans stock ne doit pas pouvoir être ajouté au panier
          expect(response.status).to.not.eq(200);
        });
      });
    });
  });

  it('POST /reviews - Ajouter un avis', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrlApi}/login`,
      body: {
        username: 'test2@test.fr',
        password: 'testtest'
      }
    }).then((loginResponse) => {
      expect(loginResponse.status).to.eq(200);

      const token = loginResponse.body.token;

      cy.request({
        method: 'POST',
        url: `${baseUrlApi}/reviews`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: {
          title: 'Tres bon produit',
          comment: 'Produit agreable a utiliser.',
          rating: 4
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

});