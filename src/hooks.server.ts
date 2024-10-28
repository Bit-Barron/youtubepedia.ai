import { lucia } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	console.log('Session ID from cookie:', sessionId);

	if (!sessionId) {
		console.log('No session ID found');
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	try {
		const { session, user } = await lucia.validateSession(sessionId);
		console.log('Session validation result:', { session, user }); // Debug log

		if (session && session.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes
			});
			console.log('Set fresh session cookie'); // Debug log
		}
		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes
			});
			console.log('Set blank session cookie'); // Debug log
		}
		event.locals.user = user;
		event.locals.session = session;
		return resolve(event);
	} catch (error) {
		console.error('Error validating session:', error); // Debug log
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}
};
