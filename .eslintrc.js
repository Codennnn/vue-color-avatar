module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      tsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['simple-import-sort'],
  rules: {
    'vue/no-v-html': 0,
    'vue/multi-word-component-names': 0,

    'simple-import-sort/imports': 1,
    'simple-import-sort/exports': 1,
    'sort-imports': 0,
    'import/order': 0,
    'import/no-unresolved': [
      2,
      {
        ignore: ['^@/', '^@@/'],
      },
    ],
    'vue/no-unused-vars': 1,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/consistent-type-imports': 1,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-explicit-any': 0,
  },
  ignorePatterns: [
    'dist',
    'public',
    '!.eslintrc.js',
    '!.prettierrc.js',
    '!.stylelintrc.js',
    '!.lintstagedrc.js',
  ],
}
