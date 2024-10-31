import { lucia } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';
import type { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { WebSocketServer } from 'ws';

declare global {
	// eslint-disable-next-line no-var
	var __socketServer: SocketIOServer | undefined;
}

interface PlatformWithServer {
	server?: HTTPServer | WebSocketServer;
}

export const handle: Handle = async ({ event, resolve }) => {
	if (!global.__socketServer) {
		const platform = event.platform as PlatformWithServer | undefined;

		if (platform?.server) {
			console.log('Setting up Socket.IO server...');
			try {
				const httpServer =
					platform.server instanceof WebSocketServer
						? platform.server.options.server
						: (platform.server as HTTPServer);

				global.__socketServer = new SocketIOServer(httpServer, {
					path: '/api/socket.io',
					cors: {
						origin: '*',
						methods: ['GET', 'POST'],
						credentials: true
					},
					transports: ['websocket', 'polling'],
					pingTimeout: 60000,
					pingInterval: 25000
				});

				global.__socketServer.on('connection', (socket) => {
					console.log('New client connected:', socket.id);

					socket.on('join_room', (transcriptId: string) => {
						console.log(`Client ${socket.id} joining room:`, transcriptId);
						socket.join(transcriptId);
						socket.emit('room_joined', { room: transcriptId });
					});

					socket.on('disconnect', () => {
						console.log('Client disconnected:', socket.id);
					});
				});

				console.log('Socket.IO server setup complete');
			} catch (error) {
				console.error('Failed to setup Socket.IO server:', error);
			}
		} else {
			console.log('No HTTP server available for Socket.IO');
		}
	}

	const lang =
		event.cookies.get('language') ||
		event.request.headers.get('accept-language')?.split(',')[0] ||
		'en';

	locale.set(lang);

	const sessionId = event.cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	try {
		const { session, user } = await lucia.validateSession(sessionId);

		if (session && session.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes
			});
		}

		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes
			});
		}

		event.locals.user = user;
		event.locals.session = session;
	} catch (error) {
		console.error('Error validating session:', error);
		event.locals.user = null;
		event.locals.session = null;
	}

	return resolve(event);
};
