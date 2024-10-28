import { lucia } from '$lib/server/auth.js';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import prisma from '../../../utils/prisma';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		try {
			const formData = await request.formData();
			const { email, password } = Object.fromEntries(formData) as Record<string, string>;

			if (!email || !password) {
				return fail(400, {
					message: 'Email and password are required'
				});
			}

			const user = await prisma.user.findUnique({
				where: { email }
			});

			console.log(user);

			const validPassword = user ? await new Argon2id().verify(user.password, password) : false;

			if (!user || !validPassword) {
				return fail(400, {
					message: 'Incorrect username or password'
				});
			}

			const session = await lucia.createSession(user.id, []);
			const sessionCookie = lucia.createSessionCookie(session.id);

			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes
			});

			throw redirect(302, '/');
		} catch (error) {
			console.error('Login error:', error);

			if (error instanceof Response) {
				throw error;
			}

			return fail(500, {
				message: 'An error occurred during login'
			});
		}
	}
};
