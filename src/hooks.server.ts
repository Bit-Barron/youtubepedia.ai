/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';
import { lucia } from '$lib/server/auth';
import { initSocketIO } from '@/server/socket';

declare global {
	var __socketio: import('socket.io').Server<import('socket.io').DefaultEventsMap, import('socket.io').DefaultEventsMap, import('socket.io').DefaultEventsMap, any> | null;
}

export const handle: Handle = async ({ event, resolve }) => {
	// Initialize socket.io if not already initialized
	if (!global.__socketio && event.platform?.server) {
		try {
			console.log('Initializing Socket.IO from hooks...');
			initSocketIO(event.platform.server);
			console.log('Socket.IO initialization from hooks completed');
		} catch (error) {
			console.error('Failed to initialize Socket.IO from hooks:', error);
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
