import prisma from '@/utils/prisma';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user?.id;

	const chats = await prisma.chat.findMany({
		where: {
			userId: userId
		}
	});


	return {
		chats
	};
};
