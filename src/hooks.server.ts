// src/hooks.server.ts
import { lucia } from '$lib/server/auth';
import { createSocketServer } from '$lib/server/socket'; // Korrigierter Import
import type { Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';
import type { Server as HTTPServer } from 'http';
import type { Server as SocketIOServer } from 'socket.io';

declare global {
	// eslint-disable-next-line no-var
	var __socketServer: SocketIOServer | undefined;
}

interface PlatformWithServer {
	server?: HTTPServer;
}

export const handle: Handle = async ({ event, resolve }) => {
	// Socket.IO Server Setup
	if (!global.__socketServer) {
		const platform = event.platform as PlatformWithServer | undefined;

		if (platform?.server) {
			console.log('Setting up Socket.IO server...');
			try {
				global.__socketServer = createSocketServer(platform.server);
				console.log('Socket.IO server setup complete');
			} catch (error) {
				console.error('Failed to setup Socket.IO server:', error);
			}
		} else {
			console.log('No HTTP server available for Socket.IO');
		}
	}

	// Locale Setup
	const lang =
		event.cookies.get('language') ||
		event.request.headers.get('accept-language')?.split(',')[0] ||
		'en';

	locale.set(lang);

	// Lucia Auth Setup
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
