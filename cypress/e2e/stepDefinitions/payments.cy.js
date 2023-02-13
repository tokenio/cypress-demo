
const { DEV } = require('../../support/config/dev_config')
const { mockRedirectPayload, bancoPostaPayload, authCallbackPayload } = require('../../fixtures/RequestPayloads')
const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor")
require('../../support/commands')

const REDIRECT_URL = DEV.TOKEN_CALLBACK.REDIRECT_URL

describe('Token Callback Two Step flow', () => {

  Given('User Sends createPaymentRequest to {string} bank id', (BANK_ID) => {
    const C_REFID = Cypress._.random(0, 1e6)
    let createPaymentPayload = {}

    if(BANK_ID == 'mock-redirect') {
        createPaymentPayload = mockRedirectPayload(BANK_ID, C_REFID, REDIRECT_URL)
    } else if(BANK_ID == 'ngp-cbi-07601-annex') {
        createPaymentPayload = bancoPostaPayload(BANK_ID, C_REFID, REDIRECT_URL)
    }

    cy.sendApiRequest('POST', 'v2/payments', { 'Content-Type': 'application/json' }, 
    createPaymentPayload)
      .its('status')
      .should('equal', 200)
      
  })

  Then('Payment status should be {string}', (status) => {
    cy.get('@response').then((response) => {
    
      const paymentStatus = response.body.payment.status;
      expect(paymentStatus).to.equal(status)
    })
  })

  When('User visits the redirect url', () => {
    cy.get('@response').then((response) => {
    
      const redirectUrl = response.body.payment.authentication.redirectUrl;
      cy.log('redirect url is: ----------> ' + redirectUrl)
      cy.visit(redirectUrl , { failOnStatusCode: false })
      cy.wrap(redirectUrl).as('redirectUrl')
    })
  })

  Then('User wait for {string} seconds', (waitTime) => {
    cy.wait(waitTime * 1000)
  })

  Then('Final url should be {string}', (final_Url) => {

    // save the final url
    cy.location().then((location) => {
      cy.wrap(location.href).as('finalUrl');
    });

    cy.get('@finalUrl').then((finalUrl) => {
      cy.log('final usr is:-----' + finalUrl)
      cy.log('final usr is:-----' + final_Url)

      const escapedSearchTerm = final_Url.replace(/[.*+?^${}()|[\]\\]/g, '$&');
      const searchRegex = new RegExp(escapedSearchTerm);

      expect(finalUrl).to.match(searchRegex);
    });
  })

  Then('User logs in via home page for bank with {string} bank id', (BANK_ID) => {

      cy.get('#username').type('user.psd');
      cy.get('#password').type('Password1_');
      cy.get('.btn-primary:nth-child(1)').click();
    
  })

  When('User fills code and sms and click on continue', () => {

    let codice_conto = ''
    let codice_sms = ''

    cy.get('.box-heading').invoke('text').then(text => {
        cy.log(text)

        cy.getStringBetween(text, "n.", "per").then(numericValue => {
          codice_conto = numericValue
          cy.log('code is: ======= ' + codice_conto)
          cy.get('#codiceconto').type('7649');
        })

        cy.getStringBetween(text, "CODICE", "per").then(numericValue => {
          codice_sms = numericValue.trim()
          cy.log('sms is:==========' + codice_sms)
          cy.get('#otp').type(codice_sms);
        })

        cy.get('input.btn-primary:nth-child(2)').click();
        
    })

})

  When('User accepts the concent on the page', () => {
      cy.get('#_prosegui').click();
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