/* eslint-disable @typescript-eslint/no-explicit-any */
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import type { ViteDevServer } from 'vite';
import { Server } from 'socket.io';
import type { ServerOptions } from 'socket.io';

let io: Server | null = null;

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		if (!io) {
			console.log('Initializing Socket.IO server in Vite...');
			io = new Server(server.httpServer, {
				cors: {
					origin: '*',
					methods: ['GET', 'POST'],
					credentials: true
				}
			} as Partial<ServerOptions>);

			// Store the io instance on the global object for access from other files
			(global as any).__socketio = io;

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

			console.log('Socket.IO server initialized successfully in Vite');
		}
	}
};

export default defineConfig({
	plugins: [sveltekit(), webSocketServer],
	server: {
		port: 3000
	}
});
