import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { lucia } from '$lib/server/auth.js';
import { redirect, type Actions } from '@sveltejs/kit';
import prisma from '../../../utils/prisma';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		console.log(data);
		const { email, password } = Object.fromEntries(data) as Record<string, string>;
		const userId = generateId(15);
		const hashedPassword = await new Argon2id().hash(password);
		const user = await prisma.user.create({
			data: {
				id: userId,
				email: email,
				password: hashedPassword
			}
		});
		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/');
	}
} satisfies Actions;
