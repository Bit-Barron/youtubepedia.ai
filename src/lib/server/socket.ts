import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import { dev } from '$app/environment';

let io: Server | null = null;
let initializationPromise: Promise<Server> | null = null;

export const initSocketIO = (httpServer: HTTPServer): Promise<Server> => {
	if (!initializationPromise) {
		initializationPromise = new Promise((resolve) => {
			if (!io) {
				console.log('Initializing Socket.IO server...');
				io = new Server(httpServer, {
					path: '/socket.io/',
					cors: {
						origin: dev ? ['http://localhost:3000'] : ['https://youtubepedia.barron.agency'],
						methods: ['GET', 'POST'],
						credentials: true
					},
					transports: ['websocket', 'polling'],
					pingTimeout: 60000,
					pingInterval: 25000,
					connectTimeout: 45000,
					allowEIO3: true
				});

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

					socket.on('disconnect', (reason) => {
						console.log(`Client disconnected (${reason})`, socket.id);
					});
				});

				console.log('Socket.IO server initialized successfully');
			}
			resolve(io);
		});
	}
	return initializationPromise;
};

export const getIO = (): Server => {
	if (!io) {
		throw new Error('Socket.IO has not been initialized');
	}
	return io;
};
