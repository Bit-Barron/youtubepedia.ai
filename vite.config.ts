import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { createWebSocketServer } from './src/lib/server/socket';

export default defineConfig({
	plugins: [sveltekit(), createWebSocketServer],
	resolve: {
		alias: {
			'@': '/src/lib'
		}
	}
});
