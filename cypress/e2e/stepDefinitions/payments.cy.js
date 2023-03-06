
const { DEV } = require('../../support/config/dev_config')
const { payloadValue, authCallbackPayload } = require('../../fixtures/RequestPayloads')
const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor")
require('../../support/commands')

const REDIRECT_URL = DEV.TOKEN_CALLBACK.REDIRECT_URL
let C_REFID = ""

describe('Token Callback Two Step flow', () => {

  Given('User Sends createPaymentRequest to {string} bank id with {string} {string} {string} {string} {string} details', 
  (BANK_ID, LOCAL_INSTRUMENT, sortCode, accountNumber, creditorIban, debtorIban) => {
    C_REFID = Cypress._.random(0, 1e6)
    cy.wrap(BANK_ID).as('bankId')
    let payload = payloadValue(BANK_ID, C_REFID, REDIRECT_URL, LOCAL_INSTRUMENT, 
      sortCode, accountNumber, creditorIban, debtorIban)
    cy.log('payload: ====' + JSON.stringify(payload))
    cy.sendApiRequest('POST', 'v2/payments', 
    payload)
      .its('status')
      .should('equal', 200)
  })

  When('User Sends OnBankAuthCallback request', () => {
    let payload = authCallbackPayload(C_REFID)
    cy.sendApiRequest('POST', 'callback/initiation', 
    payload)
      .its('status')
      .should('equal', 200)
  })

  Then('Payment status should be {string}', (status) => {
    cy.get('@response').then((response) => {
    
      const paymentStatus = response.body.payment.status;
      expect(paymentStatus).to.equal(status)
    })
  })

  When('User visits the redirect url and perform necessary action', () => {
    cy.get('@response').then((response) => {
    
      const redirectUrl = response.body.payment.authentication.redirectUrl;
      cy.log('redirect url is: ----------> ' + redirectUrl)
      cy.visit(redirectUrl , { failOnStatusCode: false })

      cy.get('@bankId').then((bankId) => {
        if(bankId == 'ob-lloyds') {
          cy.loginWithCredentials('input[placeholder="User Name"]',
          'input[placeholder="Password"]', 'button[type="submit"]',
          'llr001', 'Password123')
          cy.consentPage("label[for='mat-radio-2-input'] div[class='mat-radio-inner-circle']", "button[type='submit'] span[class='mat-button-wrapper']")
          cy.get("button[id='confirm-dialog-submit'] span[class='mat-button-wrapper']").click()
          cy.wait(2000)
        } else if (bankId == 'mbank') {
          cy.authorizePage('#authorize-button')
          cy.wait(1000)
        }else if (bankId == 'mock-redirect') {
            // do nothing
        }
      })
      
      cy.wrap(redirectUrl).as('redirectUrl')
    })
  })

  Then('User wait for {string} seconds', (waitTime) => {
    cy.wait(waitTime * 1000)
  })

  Then('Final url should contain {string} and payment id', (status) => {

    // save the final url
    cy.location().then((location) => {
      cy.wrap(location.href).as('finalUrl');
    });

    cy.get('@finalUrl').then((finalUrl) => {
      cy.log('final usr is:-----' + finalUrl)

      cy.get('@paymentId').then((paymentId) => {
        expect(finalUrl).to.contain(paymentId);
      })
      expect(finalUrl).to.contain(status);
    });
  })

  Then('Final url should contain {string} and ref id', (status) => {

    // save the final url
    cy.location().then((location) => {
      cy.wrap(location.href).as('finalUrl');
    });

    cy.get('@finalUrl').then((finalUrl) => {
      cy.log('final usr is:-----' + finalUrl)
      expect(finalUrl).to.contain(C_REFID);
      expect(finalUrl).to.contain(status);
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

  When('User Sends RedeemPayment request and gets {string} status', (status) => {
    cy.get('@response')
    .then((response) => {
      const paymentId = response.body.payment.id;
      
      cy.sendApiRequest('POST', `v2/payments/${paymentId}/redeem`)
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
      
      cy.sendApiRequest('GET', `v2/payments/${paymentId}`)
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