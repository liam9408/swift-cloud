module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    // 'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'jest'],
  rules: {
    'no-undef': 'off',
    'no-empty-pattern': 'off',
    'no-param-reassign': 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'mport/prefer-default-export': 'off',
    'no-unused-vars': 'off',
    'no-await-in-loop': 'off',
    'no-control-regex': 'off',
    // '@typescript-eslint/no-unused-vars': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.js', '**/*.test.ts'],
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    },
  },
  ignorePatterns: [
    '**/node_modules/*',
    '**/dist/*',
    '**/db/migrations/**',
    '**/db/tasks/**',
    '**/db/seeders/**',
    '**/utils/sequelize',
    '**/serverless/src/processPdf/**',
  ],
};
