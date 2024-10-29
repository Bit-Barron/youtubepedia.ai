import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { transporter } from '$lib/server/mailer';
import { generateRandomString } from 'oslo/crypto';
import prisma from '../../../../lib/utils/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const { email } = await request.json();

	try {
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			return json({
				message: 'If your email exists in our system, you will receive reset instructions.'
			});
		}

		const resetToken = generateRandomString(
			32,
			'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
		);
		const resetTokenExpiry = new Date(Date.now() + 3600000);

		await prisma.user.update({
			where: { email },
			data: {
				resetToken,
				resetTokenExpiry
			}
		});

		await transporter.sendMail({
			from: 'azerabdu5@gmail.com',
			to: email,
			subject: 'Password Reset Request',
			html: `
                <h1>Password Reset Request</h1>
                <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
                <a href="${process.env.PUBLIC_SITE_URL}/reset-password?token=${resetToken}">
                    Reset Password
                </a>
            `
		});

		return json({
			message: 'If your email exists in our system, you will receive reset instructions.'
		});
	} catch (error) {
		console.error('Password reset error:', error);
		return json({ message: 'An error occurred. Please try again later.' }, { status: 500 });
	}
};
