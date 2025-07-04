import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    {
        ignores: ['dist/*']
    },
    {
        rules: {
            "@typescript-eslint/consistent-type-definitions": ["error", "type"]
        }
    }
  }
]);
