import naverpay from '@naverpay/eslint-config'
import naverpayPlugin from '@naverpay/eslint-plugin'
import {defineConfig} from 'eslint/config'

export default defineConfig([
    {
        ignores: ['.changeset/*', '**/dist/*'],
    },
    ...naverpay.configs.node,
    ...naverpay.configs.packageJson,
    {
        plugins: {
            '@naverpay': naverpayPlugin,
        },
        rules: {
            'no-console': 'off',
            '@naverpay/peer-deps-in-dev-deps': 'error',
        },
    },
])
