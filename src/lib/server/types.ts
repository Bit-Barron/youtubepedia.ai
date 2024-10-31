import type { Server as SocketIOServer } from 'socket.io';

declare global {
	// eslint-disable-next-line no-var
	var __socketServer: SocketIOServer | undefined;

	interface Global {
		__socketServer: SocketIOServer | undefined;
	}
}

export {};
