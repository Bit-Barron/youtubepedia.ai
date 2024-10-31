import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import prisma from '@/utils/prisma';

export const actions = {
	getTranscript: async ({ request, locals, fetch }) => {
		const data = await request.formData();
		const videoUrl = data.get('videoUrl')?.toString();
		const userId = locals.user?.id;

		if (!videoUrl) {
			return fail(400, {
				success: false,
				message: 'Video URL is required'
			});
		}

		if (!userId) {
			return fail(401, {
				success: false,
				message: 'You must be logged in'
			});
		}

		try {
			const existingTranscript = await prisma.transcript.findFirst({
				where: {
					videoUrl,
					userId
				}
			});

			if (existingTranscript) {
				return {
					success: true,
					transcriptId: existingTranscript.id
				};
			}

			const response = await fetch('/api/transcript', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ video_url: videoUrl })
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				console.error('API Error:', errorData);
				return fail(response.status, {
					success: false,
					message: errorData.message || 'Failed to get transcript'
				});
			}

			const { transcript } = await response.json();
			const savedTranscript = await prisma.transcript.create({
				data: {
					id: crypto.randomUUID(),
					userId,
					videoUrl,
					content: transcript
				}
			});

			return {
				success: true,
				transcriptId: savedTranscript.id
			};
		} catch (e) {
			console.error('Error:', e);
			return fail(500, {
				success: false,
				message: 'An unexpected error occurred. Please try again.'
			});
		}
	}
} satisfies Actions;
