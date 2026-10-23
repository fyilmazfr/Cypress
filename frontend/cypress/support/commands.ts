/// <reference types="cypress" />
// ***********************************************

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8081/login',
    body: {
      username: email,
      password: password
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    cy.wrap(response.body.token).as('token');
  });
});