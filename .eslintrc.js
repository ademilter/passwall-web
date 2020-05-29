module.exports = {
  env: {
    browser: true,
    es6: true,
    jasmine: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'implicit-arrow-linebreak': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'prefer-promise-reject-errors': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/destructuring-assignment': 'off',
    'react/prop-types': 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-wrap-multilines': 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'react/jsx-curly-newline': 'off',
    '@typescript-eslint/no-namespace': 'off',

    'max-len': ['error', { code: 120 }],
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'no-console': 'error',
    'react-hooks/exhaustive-deps': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/camelcase': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
