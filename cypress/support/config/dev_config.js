const DEV = {
    API_BASE_URL : "https://api.dev.token.io",
    WEB_APP_BASE_URL: "https://web-app.dev.token.io",
    TOKEN_CALLBACK: {
      API_KEY: "bS0yTGNqREx6TW5NUlZVc3FoTXhvWW0zZEpGc1VZLTV6S3RYRUFxOjhhNGYzOGVmLWEzZGMtNDE5MC1iZmMzLTZmYmUyNzVmN2I4ZA==",
      MEMBER_ALIAS: "anna.nikulova+webhook1@token.io",
      MEMBER_ID: "m:2LcjDLzMnMRVUsqhMxoYm3dJFsUY:5zKtXEAq",
      REDIRECT_URL: "https://auth.dev.token.io/mock-integration/dumb"
    },
    TOKEN_CALLBACK_AUTOREDEEM: {
      API_KEY: "bS0zdkZiN1A2V3h5cDE0U25BamljWDZXRmRLa1JkLTV6S3RYRUFxOjM4OGUyYjk4LTQyNDQtNGQxYi1hYTEwLTM0OWRkY2NjYTUyYQ==",
      MEMBER_ALIAS: "anna-test-flow-2.com",
      MEMBER_ID: "m:3vFb7P6Wxyp14SnAjicX6WFdKkRd:5zKtXEAq",
      REDIRECT_URL: "https://auth.dev.token.io/mock-integration/dumb"
    },
    TPP_CALLBACK: {
      API_KEY: "bS0yblloQ2NvQ054NXk0RnhkZFF3bjVlcTNuYnpNLTV6S3RYRUFxOmE4NTU0ZWE2LTRkODYtNDg5NC1iNTk2LThiZWJjY2RjZjNhMg==",
      MEMBER_ALIAS: "anna.nikulova+t2-tpp-callback@token.io",
      MEMBER_ID: "m:2nYhCcoCNx5y4FxddQwn5eq3nbzM:5zKtXEAq",
      REDIRECT_URL: "https://dlng.io/test/"
    }
  }

  const getEnv = (callbackType) => {
      return env = callbackType == 'token-callback' ? DEV.TOKEN_CALLBACK :
                   callbackType == 'tpp-callback' ? DEV.TPP_CALLBACK :
                   callbackType == 'token-callback-autoredeem' ? DEV.TOKEN_CALLBACK_AUTOREDEEM :
                   DEV.TOKEN_CALLBACK
  }
  
  module.exports = { getEnv, DEV } 