import naverpay from '@naverpay/eslint-config'
import {defineConfig} from 'eslint/config'

export default defineConfig([
    {
        ignores: ['.changeset/*', '**/dist/*'],
    },
    ...naverpay.configs.node,
    ...naverpay.configs.packageJson,
    {
        rules: {
            'no-console': 'off',
        },
    },
])
