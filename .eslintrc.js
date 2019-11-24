module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    jest: true,
    browser: true
  },
  // parser: '@typescript-eslint/parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2017
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'standard',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/vue',
    'plugin:nuxt/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'prettier'
  ],
  // add your custom rules here
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
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    'camelcase': 'off',
    'nuxt/no-cjs-in-config': 'off'
  }
}
