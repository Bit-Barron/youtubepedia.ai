declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}
		interface Platform {
			server: import('http').Server | import('ws').WebSocketServer;
		}
	}
}

export {};
