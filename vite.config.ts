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
				origin: ['http://localhost:3000', 'https://youtubepedia.barron.agency'],
				methods: ['GET', 'POST'],
				credentials: true,
				allowedHeaders: ['Content-Type', 'Authorization']
			},
			path: '/socket.io',
			transports: ['websocket', 'polling'],
			pingTimeout: 60000,
			pingInterval: 25000
		} as Partial<ServerOptions>);

		io.on('connection', (socket) => {
			console.log('Client connected', socket.id);

			const userId = socket.handshake.auth.userId;
			if (userId) {
				socket.join(userId);
				console.log(`User ${userId} joined their room`);
			}

			socket.on('error', (error) => {
				console.error('Socket error:', error);
			});

			socket.on('disconnect', () => {
				console.log('Client disconnected', socket.id);
			});
		});

		// Debug Event Handler
		io.engine?.on('connection_error', (err) => {
			console.error('Connection error:', err);
		});
	}
};

export default defineConfig({
	plugins: [sveltekit(), webSocketServer],
	server: {
		port: 3000,
		host: true,
		cors: true,
		proxy: {
			'/socket.io': {
				target: 'ws://localhost:3000'
			}
		}
	}
});
