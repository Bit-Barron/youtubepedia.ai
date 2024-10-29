import { google } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '../$types';
import { generateCodeVerifier, generateState } from 'arctic';

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	const scopes = ['email', 'profile'];

	const url = google.createAuthorizationURL(state, codeVerifier, scopes);

	event.cookies.set('google_oauth_state', state, {
		httpOnly: true,
		path: '/',
		secure: true,
		maxAge: 60 * 60,
		sameSite: 'lax'
	});

	event.cookies.set('google_oauth_code_verifier', codeVerifier, {
		httpOnly: true,
		path: '/',
		secure: true,
		maxAge: 60 * 60,
		sameSite: 'lax'
	});

	return redirect(302, url.toString());
}
