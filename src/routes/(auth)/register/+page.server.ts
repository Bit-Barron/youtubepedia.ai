import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { lucia } from '$lib/server/auth.js';
import { redirect, fail, type Actions } from '@sveltejs/kit';
import prisma from '../../../utils/prisma';
import { loginSchema } from '$lib/schemas/auth';

export const actions = {
	default: async ({ request, cookies }) => {
		try {
			const formData = await request.formData();
			const data = Object.fromEntries(formData) as Record<string, string>;

			const result = loginSchema.safeParse(data);

			if (!result.success) {
				return fail(400, {
					message: 'Validation failed',
					errors: result.error.flatten().fieldErrors,
					data: { email: data.email }
				});
			}

			const { email, password } = result.data;

			const existingUser = await prisma.user.findUnique({
				where: { email }
			});

			if (existingUser) {
				return fail(400, {
					message: 'Email already registered',
					errors: { email: ['Email already in use'] },
					data: { email }
				});
			}

			const userId = generateId(15);
			const hashedPassword = await new Argon2id().hash(password);

			const user = await prisma.user.create({
				data: {
					id: userId,
					email,
					password: hashedPassword
				}
			});

			const session = await lucia.createSession(user.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);

			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes
			});

			throw redirect(302, '/');
		} catch (error) {
			console.error('Registration error:', error);

			if (error instanceof Response) {
				throw error;
			}

			return fail(500, {
				message: 'An error occurred during registration',
				errors: { server: ['Internal server error'] }
			});
		}
	}
} satisfies Actions;
