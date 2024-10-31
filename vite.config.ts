// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/api/socket.io': {
				target: 'ws://localhost:3000',
				ws: true
			}
		}
	},
	resolve: {
		alias: {
			'@': path.resolve('./src'),
			$lib: path.resolve('./src/lib')
		}
	}
});
