const jest = require('eslint-plugin-jest')
const react = require('eslint-plugin-react')
const { configs } = require('@eslint/js')
const globals = require('globals')

module.exports = [
  configs.recommended,
  {
    ignores: ['dist/*'],
  },
  {
    plugins: {
      jest,
      react
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
     },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        ...globals.react
      }
    }
  }
]
