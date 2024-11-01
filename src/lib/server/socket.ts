import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';

let io: Server | null = null;

export const initSocketIO = (httpServer: HTTPServer) => {
	if (!io) {
		io = new Server(httpServer, {
			cors: {
				origin: 'https://youtubepedia.barron.agency',
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

			socket.on('disconnect', () => {
				console.log('Client disconnected', socket.id);
			});
		});
	}
	return io;
};

export const getIO = (): Server => {
	if (!io) {
		throw new Error('Socket.IO has not been initialized');
	}
	return io;
};
