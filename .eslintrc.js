module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  globals: {
    Game: true,
  },
  plugins: [],
  rules: {
    'no-continue': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': 0,
    'prefer-template': 'off',
  },
};
