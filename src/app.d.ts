/// <reference types="lucia" />

import type { Server as HTTPServer } from 'http';
import type { Server as SocketIOServer } from 'socket.io';

declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}

		interface Platform {
			server?: HTTPServer;
			socket?: SocketIOServer;
		}
	}

	namespace Lucia {
		type Auth = import('lucia').AuthRequest;
		type DatabaseUserAttributes = {
			username: string;
			email: string;
		};
		type DatabaseSessionAttributes = Record<string, never>;
	}
}

export type {};
