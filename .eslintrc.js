module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn', // error에서 warn으로 변경
    'no-console': 'warn', // 콘솔 사용 경고
    'react/prop-types': 'off', // 타입스크립트 사용 시 prop-types off
    'prettier/prettier': 'warn', // prettier 포맷 경고
    'no-debugger': 'warn', // debugger 경고
    'react/react-in-jsx-scope': 'off', // React 17+에서는 필요 없음
    eqeqeq: 'warn', // 일치 연산자 사용 권장
    'no-var': 'error', // var 사용 금지
    'prefer-const': 'warn', // const 사용 권장
    'no-unused-vars': 'off', // JS 기본 no-unused-vars off, TS 룰만 사용
    'react/display-name': 'off',
    // TypeScript 포맷 관련 규칙 Prettier와 충돌 방지용으로 모두 off
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/type-annotation-spacing': 'off',
    '@typescript-eslint/quotes': 'off',
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/comma-dangle': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
