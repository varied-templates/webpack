module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    {{#if_eq useTypescript "Yes"}}
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint"
    {{else}}
    'prettier',
    'eslint:recommended',
    'eslint-config-prettier',
    {{/if_eq}}
  ],
  plugins: ['prettier'],
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
    parser: 'babel-eslint',
  },
};
