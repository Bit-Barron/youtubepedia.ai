import prisma from '@/utils/prisma';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	const userId = locals.user?.id;

	const user = await prisma.user.findUnique({
		where: {
			id: userId
		}
	});

	if (user?.role && user.role !== 'ADMIN') {
		redirect(302, '/');
	}

	return {
		user: locals.user
	};
};
