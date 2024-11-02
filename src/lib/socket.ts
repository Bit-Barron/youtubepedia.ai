import { browser } from '$app/environment';
import { io, type Socket } from 'socket.io-client';

export const initSocket = (userId: string): Socket | null => {
	if (browser) {
		const socketUrl = `${window.location.protocol}//${window.location.hostname}:3001`;

		const socket = io(socketUrl, {
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
