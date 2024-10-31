import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import prisma from '@/utils/prisma';

export const load: PageServerLoad = async ({ params, locals }) => {
	const userId = locals.user?.id;
	if (!userId) {
		throw error(401, 'Unauthorized');
	}

	const transcript = await prisma.transcript.findFirst({
		where: {
			id: params.id,
			userId
		}
	});

	if (!transcript) {
		throw error(404, 'Transcript not found');
	}

	return {
		transcript
	};
};

export const actions = {
	ask: async ({ request, fetch }) => {
		try {
			const data = await request.formData();
			const transcript = data.get('transcript')?.toString();
			const question = data.get('question')?.toString();

			if (!transcript || !question) {
				return fail(400, {
					success: false,
					message: 'Missing transcript or question'
				});
			}

			const response = await fetch('/api/ask', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ transcript, question })
			});

			if (!response.ok) {
				throw error(response.status, 'Failed to get answer');
			}

			const { answer } = await response.json();
			return { success: true, answer };
		} catch (e) {
			console.error('Error:', e);
			throw error(500, 'Failed to get answer');
		}
	}
} satisfies Actions;
