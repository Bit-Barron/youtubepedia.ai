import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import type { ViteDevServer } from 'vite';
import { Server } from 'socket.io';
import type { ServerOptions } from 'socket.io';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer, {
			cors: {
				origin: '*',
				methods: ['GET', 'POST'],
				credentials: true
			}
		} as Partial<ServerOptions>);

		io.on('connection', (socket) => {
			console.log('Client connected', socket.id);

			const userId = socket.handshake.auth.userId;
			if (userId) {
				socket.join(userId);
				console.log(`User ${userId} joined their room`);
			}

			socket.on('disconnect', () => {
				console.log('Client disconnected', socket.id);
			});
		});
	}
};

export default defineConfig({
	plugins: [sveltekit(), webSocketServer],
	server: {
		port: 3000
	}
});
