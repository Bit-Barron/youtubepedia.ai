export interface Message {
	type: 'user' | 'bot';
	content: string;
}

export interface ChatData {
	videoUrl: string;
	transcript: string;
	messages: Message[];
}

import type { Server as SocketIOServer } from 'socket.io';

declare global {
	// eslint-disable-next-line no-var
	var __socketServer: SocketIOServer | undefined;

	interface Global {
		__socketServer: SocketIOServer | undefined;
	}
}

export {};
