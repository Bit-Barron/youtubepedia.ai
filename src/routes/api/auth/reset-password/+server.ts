import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Argon2id } from 'oslo/password';
import prisma from '@/utils/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const { token, password } = await request.json();

	try {
		const user = await prisma.user.findFirst({
			where: {
				resetToken: token,
				resetTokenExpiry: {
					gt: new Date()
				}
			}
		});

		if (!user) {
			return json({ message: 'Invalid or expired reset token' }, { status: 400 });
		}

		const hashedPassword = await new Argon2id().hash(password);

		await prisma.user.update({
			where: { id: user.id },
			data: {
				password: hashedPassword,
				resetToken: null,
				resetTokenExpiry: null
			}
		});

		return json({
			message: 'Password reset successful. You can now login with your new password.'
		});
	} catch (error) {
		console.error('Reset password error:', error);
		return json({ message: 'An error occurred. Please try again later.' }, { status: 500 });
	}
};
