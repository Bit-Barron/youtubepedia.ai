/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';

let io: Server | null = null;

export const initSocketIO = (httpServer: HTTPServer) => {
	if (!io) {
		console.log('Initializing Socket.IO server...');
		io = new Server(httpServer, {
			path: '/socket.io',
			cors: {
				origin: ['https://youtubepedia.barron.agency', 'http://localhost:3000'],
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

		console.log('Socket.IO server initialized successfully');
	}
	return io;
};

export const getIO = (): Server => {
	if (!io) {
		console.warn('Socket.IO accessed before initialization, waiting...');
		return new Proxy({} as Server, {
			get: (target, prop) => {
				if (prop === 'to' || prop === 'emit') {
					return (...args: any[]) => {
						setTimeout(() => {
							const realIO = getIO();
							if (realIO && prop in realIO) {
								(realIO[prop as keyof Server] as any)(...args);
							}
						}, 100);
					};
				}
				return () => {
					console.warn('Socket.IO method called before initialization');
				};
			}
		});
	}
	return io;
};

export const isSocketInitialized = (): boolean => {
	return io !== null;
};
