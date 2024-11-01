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
		},
		include: {
			chats: {
				orderBy: {
					createdAt: 'asc'
				}
			}
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
	ask: async ({ request, fetch, locals }) => {
		try {
			const userId = locals.user?.id;
			if (!userId) {
				return fail(401, {
					success: false,
					message: 'Unauthorized'
				});
			}

			const data = await request.formData();
			const transcriptId = data.get('transcriptId')?.toString();
			const transcript = data.get('transcript')?.toString();
			const question = data.get('question')?.toString();

			if (!transcript || !question || !transcriptId) {
				return fail(400, {
					success: false,
					message: 'Missing required fields'
				});
			}

			const questionChat = await prisma.chat.create({
				data: {
					id: crypto.randomUUID(),
					userId,
					message: question,
					type: 'QUESTION',
					transcriptId,
					createdAt: new Date()
				}
			});

			const response = await fetch('/api/ask', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ transcript, question })
			});

			const responseText = await response.text();
			let responseData;

			try {
				responseData = JSON.parse(responseText);
			} catch (e) {
				return fail(500, {
					success: false,
					message: e
				});
			}

			if (
				responseText.includes('context_length_exceeded') ||
				responseText.includes('Please reduce the length of the messages')
			) {
				return fail(413, {
					success: false,
					message:
						'The transcript is too long to process. Please try breaking your question into smaller parts or focus on a specific section.'
				});
			}

			if (!response.ok) {
				return fail(response.status, {
					success: false,
					message: 'Failed to get answer. Please try again.'
				});
			}

			const answerChat = await prisma.chat.create({
				data: {
					id: crypto.randomUUID(),
					userId,
					message: responseData.answer,
					type: 'ANSWER',
					transcriptId,
					createdAt: new Date()
				}
			});

			return {
				success: true,
				answer: responseData.answer,
				chats: [questionChat, answerChat]
			};
		} catch (e) {
			console.error('Error:', e);
			const errorMessage = e instanceof Error ? e.message : String(e);
			if (
				errorMessage.includes('context_length_exceeded') ||
				errorMessage.includes('Please reduce the length of the messages')
			) {
				return fail(413, {
					success: false,
					message:
						'The transcript is too long to process. Please try breaking your question into smaller parts or focus on a specific section.'
				});
			}
			return fail(500, {
				success: false,
				message: 'An unexpected error occurred. Please try again.'
			});
		}
	}
} satisfies Actions;
