module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'] // required for "type-aware linting"
  },
  plugins: ['@typescript-eslint', 'prettier'],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': 1, // warn
    semi: 0,
    quotes: [0, 'single'],
    'no-console': 2, // Error
    'prefer-const': 'error',
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false
      }
    ]
  }
}
