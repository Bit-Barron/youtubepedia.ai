import { browser } from '$app/environment';
import { io, type Socket } from 'socket.io-client';

export const initSocket = (userId: string): Socket | null => {
	if (browser) {
		const socket = io(window.location.origin, {
			path: '/socket.io',
			auth: { userId },
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 5,
			transports: ['polling', 'websocket'], // Start with polling first
			upgrade: true,
			rememberUpgrade: true,
			timeout: 10000,
			forceNew: true
		});

		socket.on('connect', () => {
			console.log('Connected to socket server with transport:', socket.io.engine.transport.name);
		});

		socket.on('connect_error', (error) => {
			console.error('Socket connection error:', error);
		});

		socket.on('disconnect', (reason) => {
			console.log('Disconnected:', reason);
			if (reason === 'io server disconnect') {
				socket.connect();
			}
		});

		return socket;
	}
	return null;
};
