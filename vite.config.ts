import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import type { ViteDevServer } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'socketIO',
			configureServer(server: ViteDevServer) {
				if (!server.httpServer) return;

				import('./src/lib/server/socket')
					.then(({ setupSocketIO }) => {
						setupSocketIO(server.httpServer as never);
						console.log('Socket.IO server initialized');
					})
					.catch((err) => {
						console.error('Failed to initialize Socket.IO:', err);
					});
			}
		}
	],
	server: {
		port: 3333, // Änderung hier: Neuer Port
		strictPort: true,
		host: true
	}
});
