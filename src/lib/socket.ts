import { browser } from '$app/environment';
import { io, type Socket } from 'socket.io-client';

export const initSocket = (userId: string): Socket | null => {
	if (browser) {
		const socketUrl = window.location.origin;
		console.log('Initializing socket connection to:', socketUrl);

		const socket = io(socketUrl, {
			path: '/socket.io',
			auth: { userId },
			transports: ['polling', 'websocket'],
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			timeout: 20000,
			autoConnect: true,
			withCredentials: true
		});

		socket.on('connect', () => {
			console.log(
				'Connected to socket server',
				'ID:',
				socket.id,
				'Transport:',
				socket.io.engine.transport.name
			);
		});

		socket.on('connect_error', (error) => {
			console.error('Socket connection error:', error);
			// Log additional debugging information
			console.log('Current transport:', socket.io.engine.transport.name);
			// console.log('Available transports:', socket.io.engine.transports);
		});

		socket.on('disconnect', (reason) => {
			console.log('Disconnected:', reason);
			if (reason === 'io server disconnect') {
				// the disconnection was initiated by the server, reconnect automatically
				socket.connect();
			}
		});

		socket.on('error', (error) => {
			console.error('Socket error:', error);
		});

		// Monitor transport changes
		socket.io.engine.on('upgrade', (transport) => {
			console.log('Transport upgraded to:', transport.name);
		});

		return socket;
	}
	return null;
};
