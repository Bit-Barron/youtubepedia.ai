import { browser } from '$app/environment';
import { io, type Socket } from 'socket.io-client';

export const initSocket = (userId: string): Socket | null => {
	if (browser) {
		// Kein expliziter Port - nutze den gleichen Port wie die App
		const socket = io(window.location.origin, {
			auth: { userId },
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 5,
			path: '/socket.io' // Muss mit Server-Path übereinstimmen
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
