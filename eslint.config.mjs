// eslint.config.js
import eslint from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'
import globals from 'globals'

export default [
  eslint.configs.recommended,

  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],

    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },

      // FIX FOR YOUR ERROR: set environments / globals
      globals: {
        ...globals.node, // allows console, process, __dirname, etc.
        ...globals.browser, // allows window, document, fetch
      },
    },

    plugins: {
      '@typescript-eslint': tseslint,
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Ignore build folders
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '*.config.js'],
  },
]
