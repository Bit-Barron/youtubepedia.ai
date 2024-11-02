/* eslint-disable no-var */
import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import { dev } from '$app/environment';

// Access the global io instance
declare global {
	var __socketio: Server | null;
}

export const getIO = (): Server => {
	if (dev) {
		// In development, use the Vite-initialized socket
		if (!global.__socketio) {
			throw new Error('Socket.IO not initialized yet');
		}
		return global.__socketio;
	} else {
		// In production, initialize normally
		if (!global.__socketio) {
			throw new Error('Socket.IO not initialized yet');
		}
		return global.__socketio;
	}
};

export const initSocketIO = (httpServer: HTTPServer): void => {
	if (!global.__socketio) {
		console.log('Initializing Socket.IO server...');
		const io = new Server(httpServer, {
			path: '/socket.io',
			cors: {
				origin: dev ? ['http://localhost:3000'] : ['https://youtubepedia.barron.agency'],
				methods: ['GET', 'POST'],
				credentials: true
			},
			transports: ['websocket', 'polling']
		});

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

		global.__socketio = io;
		console.log('Socket.IO server initialized successfully');
	}
};
