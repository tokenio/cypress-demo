
const { DEV } = require('../../support/config/dev_config')
const { createPaymentPayload, authCallbackPayload } = require('../../fixtures/RequestPayloads')
const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor")

const API_URL = DEV.API_BASE_URL
const API_KEY = DEV.TOKEN_CALLBACK.API_KEY
const REDIRECT_URL = DEV.TOKEN_CALLBACK.REDIRECT_URL
const C_REFID = Cypress._.random(0, 1e6)


Cypress.Commands.add('sendApiRequest', (method, endpoint, headers = {}, data = {}) => {
  cy.request({
    method: method,
    url: `${API_URL}/${endpoint}`,
    headers: {
      ...headers,
      Authorization: `Basic ${API_KEY}`,
    },
    body: data,
    withCredentials: true,
  }).as('response')
})

// intercept api request and print as curl request
Cypress.Commands.add('interceptApiRequest', (method, endpoint, headers) => {
  cy.intercept({
    method: method,
    url: `${API_URL}/${endpoint}`,
    headers: {
      ...headers,
      Authorization: `Basic ${API_KEY}`,
    }
  }
  , 
  { 
    status: 200, 
    headers: { 'Content-Type': 'application/json;charset=utf-8' }, 
    // body: { message: 'Successful' } 
  }
  ).as('apiInterception');
})


describe('Token Callback Two Step flow', () => {

  Given('User Sends createPaymentRequest to {string} bank id', (BANK_ID) => {

    cy.sendApiRequest('POST', 'v2/payments', { 'Content-Type': 'application/json' }, 
    createPaymentPayload(BANK_ID, C_REFID, REDIRECT_URL))
      .its('status')
      .should('equal', 200)
      
  })

  When('User visits the redirect url', () => {
    cy.get('@response').then((response) => {
      const redirectUrl = response.body.payment.authentication.redirectUrl;
      cy.log('redirect url is: ----------> ' + redirectUrl)
      cy.visit(redirectUrl , { failOnStatusCode: false })

      // save the final url
      cy.location().then((location) => {
        cy.wrap(location.href).as('finalUrl');
      });
    })
  })

  Then('Final url should be {string}', (final_Url) => {
    cy.get('@finalUrl').then((finalUrl) => {
      cy.log('final usr is:-----' + finalUrl)
      cy.log('final usr is:-----' + final_Url)

      const escapedSearchTerm = final_Url.replace(/[.*+?^${}()|[\]\\]/g, '$&');
      const searchRegex = new RegExp(escapedSearchTerm);

      expect(finalUrl).to.match(searchRegex);
    });
  })

  When('Token redeems the payment and gets {string} status', (status) => {
    cy.get('@response').its('body').should('have.property', 'payment')
    cy.get('@response')
    .then((response) => {
      const paymentId = response.body.payment.id;
      
      cy.sendApiRequest('POST', `v2/payments/${paymentId}/redeem`, { 'Content-Type': 'application/json' })
        .its('status')
        .should('equal', 200)

        cy.get('@response')
        .then((response) => {
          const paymentStatus = response.body.payment.status;
          expect(paymentStatus).to.equal(status);
        })
    })
  })

  Then('User sends getPayment request and gets {string} status', (status) => {
    cy.get('@response').its('body').should('have.property', 'payment')
    cy.get('@response')
    .then((response) => {
      const paymentId = response.body.payment.id;
      
      cy.sendApiRequest('GET', `v2/payments/${paymentId}`, { 'Content-Type': 'application/json' })
        .its('status')
        .should('equal', 200)

        cy.get('@response')
        .then((response) => {
          const paymentStatus = response.body.payment.status;
          expect(paymentStatus).to.equal(status);
        })
    })
  })

})