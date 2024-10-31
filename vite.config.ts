import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/api/socket': {
				target: 'http://localhost:5173/',
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
