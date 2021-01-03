module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    {{#if_eq useTypescript "Yes"}}
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint"
    {{else}}
    'prettier',
    'eslint-config-prettier',
    {{/if_eq}}
  ],
  {{#if_eq useTypescript "No"}}
  plugins: ['prettier'],
  {{/if_eq}}
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 'off',
    'prettier/prettier': 'warn',
    "no-useless-escape": 'off', // 关闭禁止转义字符
    {{#if_eq useTypescript "Yes"}}
    "@typescript-eslint/ban-ts-ignore": "off"
    {{/if_eq}}
  },
  parserOptions: {
    {{#if_eq useTypescript "Yes"}}
    parser: '@typescript-eslint/parser',
    {{else}}
    parser: 'babel-eslint',
    {{/if_eq}}
  },
};
