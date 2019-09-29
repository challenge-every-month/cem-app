module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
  ],
  extends: [
    'standard',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'prettier/prettier': ['error',
      {
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        semi: false,
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
        arrowParens: 'avoid',
      }
    ],
    'block-scoped-var': 'off',
    'quotes': ['error', 'backtick'],
    'complexity': 'warn',
    'default-case': 'warn',
    'eol-last': 'off',
    'no-console': 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-eval': 'error',
    'no-script-url': 'warn',
    'no-var': 'error',
    'no-void': 'error',
    'prefer-const': 'warn',
    'space-after-keywords': 'off',
    'space-return-throw-case': 'off',
    'require-jsdoc': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    'camelcase': 'off'
  },
}
