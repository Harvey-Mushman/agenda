module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  parser: "@babel/eslint-parser",
  rules: {
    "quotes": ["error", "double"],
    "max-len": ["error", {"code": 1024}],
  },
  parserOptions: {
    ecmaVersion: 8, // or 2017
  },
};
