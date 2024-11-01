import type { Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';
import { lucia } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
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
