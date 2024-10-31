import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import prisma from '@/utils/prisma';

// Definieren Sie den Chat-Typ
type Chat = {
	id: string;
	userId: string;
	message: string;
	type: 'QUESTION' | 'ANSWER';
	transcriptId: string;
	createdAt: Date;
};

// Definieren Sie den Transcript-Typ mit chats
type TranscriptWithChats = {
	id: string;
	userId: string;
	videoUrl: string;
	content: string;
	createdAt: Date;
	chats: Chat[];
};

// Typisieren Sie die Load-Funktion
export const load: PageServerLoad = async ({ params, locals }): Promise<TranscriptWithChats> => {
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

	return transcript as TranscriptWithChats;
};

export const actions = {
	ask: async ({ request, fetch, locals }) => {
		try {
			const userId = locals.user?.id;
			if (!userId) {
				throw error(401, 'Unauthorized');
			}

			const data = await request.formData();
			const transcriptId = data.get('transcriptId')?.toString();
			const transcript = data.get('transcript')?.toString();
			const question = data.get('question')?.toString();

			if (!transcript || !question || !transcriptId) {
				return fail(400, {
					success: false
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

			if (!response.ok) {
				throw error(response.status, 'Failed to get answer');
			}

			const { answer } = await response.json();

			const answerChat = await prisma.chat.create({
				data: {
					id: crypto.randomUUID(),
					userId,
					message: answer,
					type: 'ANSWER',
					transcriptId,
					createdAt: new Date()
				}
			});

			return {
				success: true,
				answer,
				chats: [questionChat, answerChat]
			};
		} catch (e) {
			console.error('Error:', e);
			throw error(500, 'Failed to get answer');
		}
	}
} satisfies Actions;
