import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';

let io: Server | null = null;

export const getIO = () => {
	if (!io) {
		throw new Error('Socket.IO has not been initialized');
	}
	return io;
};

export const initSocketIO = (server: HTTPServer) => {
	if (!io) {
		io = new Server(server);

		io.on('connection', (socket) => {
			console.log('Client connected', socket.id);

			socket.on('join-room', (userId: string) => {
				socket.join(userId);
				console.log(`User ${userId} joined their room`);
			});

			socket.on('disconnect', () => {
				console.log('Client disconnected', socket.id);
			});
		});
	}
	return io;
};
