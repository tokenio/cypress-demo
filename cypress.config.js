const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const addCucumberPreprocessorPlugin = require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin
const createEsbuildPlugin =
  require('@badeball/cypress-cucumber-preprocessor/esbuild').createEsbuildPlugin

module.exports = defineConfig({
  // projectId: 'your-project-id',
  e2e: {
    specPattern: '**/e2e/**/*.spec.js',
    chromeWebSecurity: false,
    supportFile: false,
    specPattern: "cypress/e2e/features/*.feature",
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/results',
      overwrite: false,
      html: true,
      json: true,
    },
    async setupNodeEvents(on, config) {

      const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)]
      })

      on('file:preprocessor', bundler)
      await addCucumberPreprocessorPlugin(on, config)

      return config
    },
  },
});