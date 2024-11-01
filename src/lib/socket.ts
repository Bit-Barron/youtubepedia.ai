import { browser } from '$app/environment';
import { io, type Socket } from 'socket.io-client';

export const initSocket = (userId: string): Socket | null => {
	if (browser) {
		const socketUrl = import.meta.env.PUBLIC_SOCKET_URL || window.location.origin;

		const socket = io(socketUrl, {
			auth: { userId },
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 5,
			path: '/socket.io',
			transports: ['websocket']
		});

		socket.on('connect_error', (error) => {
			console.error('Socket connection error:', error);
		});

		return socket;
	}
	return null;
};
