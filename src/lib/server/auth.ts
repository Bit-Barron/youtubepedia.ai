import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import client from '../../utils/prisma';
import { Google } from 'arctic';

const adapter = new PrismaAdapter(client.session, client.user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			email: attributes.email
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	email: string;
}

function createGoogleAuth() {
	if (dev) {
		console.log('Google OAuth credentials:', {
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET?.slice(0, 4) + '...'
		});
	}

	if (dev || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
		return new Google(
			process.env.GOOGLE_CLIENT_ID || 'dummy-id',
			process.env.GOOGLE_CLIENT_SECRET || 'dummy-secret',
			'http://localhost:5173/auth/callback/google'
		);
	}

	return new Google(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		'http://localhost:5173/auth/callback/google'
	);
}

export const google = createGoogleAuth();

export function isGoogleAuthConfigured(): boolean {
	return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}
