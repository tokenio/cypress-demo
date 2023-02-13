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
const API_KEY = DEV.TOKEN_CALLBACK.API_KEY

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
  
  Cypress.Commands.add("getStringBetween", (text, start, end) => {
    const startIndex = text.indexOf(start) + start.length;
    const endIndex = text.indexOf(end);
    return text.substring(startIndex, endIndex);
  });
  