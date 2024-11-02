import { browser } from '$app/environment';
import { io, type Socket } from 'socket.io-client';

export const initSocket = (userId: string): Socket | null => {
	if (browser) {
		// Determine the socket URL based on the current environment
		const socketUrl = browser
			? // In production, use the same origin as the web app
				window.location.origin
			: // In development, use explicit port
				`${window.location.protocol}//${window.location.hostname}:3001`;

		const socket = io(socketUrl, {
			auth: { userId },
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 5,
			path: '/socket.io' // Explicitly set the socket.io path
		});

		socket.on('connect', () => {
			console.log('Connected to socket server');
		});

		socket.on('connect_error', (error) => {
			console.error('Socket connection error:', error.message);
			// Add more detailed error logging
			if (error instanceof Error) {
				console.error('Error details:', {
					message: error.message,
					name: error.name,
					stack: error.stack
				});
			}
		});

		return socket;
	}
	return null;
};
