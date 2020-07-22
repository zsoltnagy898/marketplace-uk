const root = `${__dirname}/..`

module.exports = {
  roots: [root],
  preset: "jest-puppeteer",
  testMatch: ["**/__tests__/**/*.test.js"]
}
// `setupTestFrameworkScriptFile` it's being set up by default and takes what is in ./setup-tests.js
