import { browser } from '$app/environment';
import { io, type Socket } from 'socket.io-client';
import { writable } from 'svelte/store';

export const socket = writable<Socket>();

export const initSocketClient = (userId: string) => {
	if (browser) {
		const socketClient = io({
			auth: { userId },
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 5
		});

		socketClient.on('connect', () => {
			console.log('Connected to server');
			socketClient.emit('join-room', userId);
		});

		socket.set(socketClient);
		return socketClient;
	}
};
