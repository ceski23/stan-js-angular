import { defineConfig } from 'tsdown'

export default defineConfig({
	format: ['esm', 'commonjs'],
	exports: true,
})
