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
			transports: ['websocket', 'polling']
		});

		socket.on('connect', () => {
			console.log('Connected to socket server');
		});

		socket.on('connect_error', (error) => {
			console.error('Socket connection error:', error);
		});

		return socket;
	}
	return null;
};