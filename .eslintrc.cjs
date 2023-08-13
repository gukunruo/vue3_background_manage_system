module.exports = {
  // 运行环境
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  // 指定如何解析语法
  parser: 'vue-eslint-parser',
  // 解析器选项 优先级低于 parser 的语法解析配置
  parserOptions: {
    ecmaVersion: 'latest',
    // 指定解析器为ts解析器 由于优先级低于选项parser，所以先按照vue检测再按照ts检测
    parser: '@typescript-eslint/parser',
    sourceType: 'module', // 默认设置为"script"，我们此处设置"module",eslint会校验ECMAScript module模块化中的语法
    jsxPragma: 'React',
    ecmaFeatures: {
      jax: true,
    },
  },
  // 规则继承 继承已有的规则
  extends: [
    'eslint:recommended', // 开启推荐的规则
    'plugin:vue/vue3-essential', // vue3规则
    'plugin:@typescript-eslint/recommended', // ts语法规则
    'plugin:prettier/recommended', // prettier规则
  ],
  // eslint支持三方插件,使用前必须下载 eslint-plugin-前缀可以从插件名称被省略
  plugins: ['vue', '@typescript-eslint'],
  // rules eslint详细规则,参考官网
  /*
   * "off" 或 0    ==>  关闭规则
   * "warn" 或 1   ==>  打开的规则作为警告（不影响代码执行）
   * "error" 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
   */
  rules: {
    // eslint（https://eslint.bootcss.com/docs/rules/）
    'no-var': 'error', // 要求使用 let 或 const 而不是 var
    'no-multiple-empty-lines': ['warn', { max: 1 }], // 不允许多个空行
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unexpected-multiline': 'error', // 禁止空余的多行
    'no-useless-escape': 'off', // 禁止不必要的转义字符【关闭】

    // typeScript (https://typescript-eslint.io/rules)
    // 'typescript-eslint/no-unused-vars': 'error', // 禁止定义未使用的变量
    '@typescript-eslint/prefer-ts-expect-error': 'error', // 禁止使用 @ts-ignore
    '@typescript-eslint/no-explicit-any': 'off', // 禁止使用 any 类型【关闭】
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-namespace': 'off', // 禁止使用自定义 TypeScript 模块和命名空间。【关闭】
    '@typescript-eslint/semi': 'off', // 分号

    // eslint-plugin-vue (https://eslint.vuejs.org/rules/)
    'vue/multi-word-component-names': 'off', // 要求组件名称始终为 “-” 链接的单词【关闭】
    'vue/script-setup-uses-vars': 'error', // 防止<script setup>使用的变量<template>被标记为未使用
    'vue/no-mutating-props': 'off', // 不允许组件 prop的改变【关闭】
    'vue/attribute-hyphenation': 'off', // 对模板中的自定义组件强制执行属性命名样式【关闭】
  },
}
