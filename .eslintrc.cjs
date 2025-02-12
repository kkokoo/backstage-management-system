/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-prettier/skip-formatting'],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        //代码美观度的配置
        'prettier/prettier': [
            'warn',
            {
                singleQuote: true, //单引号
                semi: false, //无分号
                printWidth: 160, //每行宽度至多80字符
                trailingComma: 'none', //不加对象|数组最后逗号
                endOfLine: 'auto', //换行符号不限制（win mac 不一致）
                tabWidth: 4
            }
        ],
        //代码规范程度的配置
        'vue/multi-word-component-names': ['warn', { ignores: ['index'] }],
        'vue/no-setup-props-destructure': ['off'],
        'no-undef': 'error'
    },
    globals: {
        ElMessage: 'readonly',
        ElMessageBox: 'readonly',
        ElLoading: 'readonly'
    }
}
