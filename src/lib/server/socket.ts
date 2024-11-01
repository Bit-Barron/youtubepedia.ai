import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';

let io: Server | null = null;

export const getIO = (): Server => {
	if (!io) {
		throw new Error('Socket.IO has not been initialized');
	}
	return io;
};

export const initSocketIO = (server: HTTPServer): Server => {
	if (!io) {
		io = new Server(server, {
			cors: {
				origin: process.env.PUBLIC_CLIENT_URL || 'http://localhost:3000',
				methods: ['GET', 'POST'],
				credentials: true
			}
		});

		io.on('connection', (socket) => {
			console.log('Client connected', socket.id);

			const userId = socket.handshake.auth.userId;
			if (userId) {
				socket.join(userId);
				console.log(`User ${userId} joined their room`);
			}

			socket.on('join-room', (roomId: string) => {
				socket.join(roomId);
				console.log(`Socket ${socket.id} joined room ${roomId}`);
			});

			socket.on('disconnect', () => {
				console.log('Client disconnected', socket.id);
			});

			socket.on('error', (error) => {
				console.error('Socket error:', error);
			});
		});
	}
	return io;
};
