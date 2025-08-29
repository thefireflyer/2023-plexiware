import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'node:fs'

export default defineConfig({
	server: {
		https: {
			key: fs.readFileSync('key.pem'),
			cert: fs.readFileSync('cert.pem'),
		}
	},
	plugins: [sveltekit()]
});
