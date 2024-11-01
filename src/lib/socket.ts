import { browser } from '$app/environment';
import { io, type Socket } from 'socket.io-client';
import { writable } from 'svelte/store';

export const socket = writable<Socket>();

export const initSocket = (userId: string): Socket | null => {
	if (browser) {
		const socketClient = io('http://localhost:3001', {
			auth: { userId },
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 5,
			withCredentials: true
		});

		socketClient.on('connect', () => {
			console.log('Connected to WebSocket server');
		});

		socketClient.on('connect_error', (error) => {
			console.error('Connection error:', error);
		});

		socket.set(socketClient);
		return socketClient;
	}
	return null;
};
