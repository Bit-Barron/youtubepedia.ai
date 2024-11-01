import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { lucia } from '$lib/server/auth.js';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import prisma from '@/utils/prisma';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}

	return {
		user: locals.user
	};
};

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const { email, password } = Object.fromEntries(data) as Record<string, string>;
		const userId = generateId(15);
		const hashedPassword = await new Argon2id().hash(password);
		const userAlreadyExists = await prisma.user.findFirst({
			where: {
				email
			}
		});

		if (userAlreadyExists) {
			return fail(400);
		}

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
