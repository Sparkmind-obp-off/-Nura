import js from '@eslint/js'
import tseslint from 'typescript-eslint'

const browserGlobals = {
  document: 'readonly',
  localStorage: 'readonly',
  fetch: 'readonly',
  FormData: 'readonly',
}

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', '.wrangler/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx', 'tests/**/*.ts'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
  {
    files: ['public/**/*.js'],
    languageOptions: { globals: browserGlobals },
  },
  {
    files: ['ecosystem.config.cjs'],
    languageOptions: { globals: { module: 'readonly' } },
  },
)
