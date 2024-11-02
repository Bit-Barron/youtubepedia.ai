/* eslint-disable no-var */
import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import { dev } from '$app/environment';
import type { ServerOptions } from 'socket.io';

declare global {
	var __socketio: Server | null;
}

const SOCKET_CONFIG: Partial<ServerOptions> = {
	path: '/socket.io',
	cors: {
		origin: dev ? ['http://localhost:3000'] : ['https://youtubepedia.barron.agency'],
		methods: ['GET', 'POST'],
		credentials: true,
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
	},
	transports: ['polling', 'websocket'],
	allowUpgrades: true,
	upgradeTimeout: 10000,
	pingInterval: 25000,
	pingTimeout: 20000,
	connectTimeout: 45000,
	allowEIO3: true,
	maxHttpBufferSize: 1e8,
	perMessageDeflate: {
		threshold: 1024
	},
	httpCompression: {
		threshold: 1024
	},
	cookie: {
		name: 'io',
		path: '/',
		httpOnly: true,
		sameSite: 'lax'
	}
};

export const initSocketIO = (httpServer: HTTPServer): void => {
	if (!global.__socketio) {
		console.log('Initializing Socket.IO server...');
		const io = new Server(httpServer, SOCKET_CONFIG);

		io.engine.on('connection_error', (err) => {
			console.log('Connection error:', err);
		});

		io.engine.on('initial_headers', (headers: Record<string, string>) => {
			headers['Access-Control-Allow-Credentials'] = 'true';
			if (dev) {
				headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
			} else {
				headers['Access-Control-Allow-Origin'] = 'https://youtubepedia.barron.agency';
			}
		});

		io.on('connection', (socket) => {
			console.log(
				'Client connected',
				socket.id,
				'transport:',
				socket.conn.transport.name,
				'headers:',
				socket.handshake.headers
			);

			const userId = socket.handshake.auth.userId;
			if (userId) {
				socket.join(userId);
				console.log(`User ${userId} joined their room`);
			}

			socket.on('disconnect', (reason) => {
				console.log('Client disconnected', socket.id, 'reason:', reason);
			});

			socket.on('error', (error) => {
				console.error('Socket error:', error);
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
