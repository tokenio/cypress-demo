// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const { DEV } = require('../support/config/dev_config')
const API_URL = DEV.API_BASE_URL

Cypress.Commands.add('sendApiRequest', (apikey, method, endpoint, requestBody = {}, headers = {}) => {
  const requestUrl = `${API_URL}/${endpoint}`
  const options = {
    method: method,
      url: requestUrl,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        Authorization: `Basic ${apikey}`,
      },
      body: requestBody,
      withCredentials: true
  };

  cy.request(options).then((response) => {
    const curlRequest = `curl -X ${method} -H '${JSON.stringify(headers)}' -d '${JSON.stringify(requestBody)}' ${requestUrl}`;

    cy.log(curlRequest);
    cy.log('curl request is: ==' + response.request)
    cy.wrap(response.body.payment.id).as('paymentId')
    cy.wrap(response).as('response')
    
  })

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

  Cypress.Commands.add('loginWithCredentials', (usernameLocator, passwordLocator, submitLocator, username, password) => {
    cy.get(usernameLocator).type(username);
    cy.get(passwordLocator).type(password);
    cy.get(submitLocator).click();
  });

  // in case of selecting a radio button and submit button
  Cypress.Commands.add('consentPage', (selectAccountLocator, submitLocator) => {
    cy.get(selectAccountLocator).click();
    cy.wait(1000);
    cy.get(submitLocator).scrollIntoView();
    cy.get(submitLocator).click();
  });

  // in case of selecting a radio button and submit button
  Cypress.Commands.add('authorizePage', (authorizeButtonLocator) => {
    cy.get(authorizeButtonLocator).click();
  });
  
  Cypress.Commands.add("getStringBetween", (text, start, end) => {
    const startIndex = text.indexOf(start) + start.length;
    const endIndex = text.indexOf(end);
    return text.substring(startIndex, endIndex);
  });
  