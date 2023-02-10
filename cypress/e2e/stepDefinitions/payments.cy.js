
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
  })
})

describe('Token Callback Two Step flow', () => {

  Given('User Sends createPaymentRequest', () => {
    cy.log(C_REFID);
    cy.sendApiRequest('POST', 'v2/payments', { 'Content-Type': 'application/json' }, 
    createPaymentPayload(C_REFID, REDIRECT_URL))
      .its('status')
      .should('equal', 200)
  })

})