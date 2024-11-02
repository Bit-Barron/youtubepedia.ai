/* eslint-disable no-var */
import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import { dev } from '$app/environment';
import type { ServerOptions } from 'socket.io';

declare global {
	var __socketio: Server | null;
}

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
			transports: ['polling', 'websocket'],
			allowUpgrades: true,
			upgradeTimeout: 10000,
			pingInterval: 10000,
			pingTimeout: 5000,
			cookie: {
				name: 'io',
				path: '/',
				httpOnly: true,
				sameSite: 'strict'
			},
			allowEIO3: true,
			connectTimeout: 45000
		} as Partial<ServerOptions>);

		io.engine.on('connection_error', (err) => {
			console.log('Connection error:', err);
		});

		io.on('connection', (socket) => {
			console.log('Client connected', socket.id, 'transport:', socket.conn.transport.name);

			const userId = socket.handshake.auth.userId;
			if (userId) {
				socket.join(userId);
				console.log(`User ${userId} joined their room`);
			}

			socket.on('disconnect', (reason) => {
				console.log('Client disconnected', socket.id, 'reason:', reason);
			});
		});

		global.__socketio = io;
		console.log('Socket.IO server initialized successfully');
	}
};

export const getIO = (): Server => {
	if (!global.__socketio) {
		throw new Error('Socket.IO not initialized');
	}
	return global.__socketio;
};
