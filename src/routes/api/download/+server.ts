import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { downloadTranscript } from '$lib/server/transcriber';

export const GET: RequestHandler = async () => {
	try {
		const transcript = await downloadTranscript('https://www.youtube.com/watch?v=6v2L2UGZJAM');

		return new Response(transcript, {
			headers: {
				'Content-Type': 'text/plain',
				'Content-Disposition': 'attachment; filename="transcript.txt"'
			}
		});
	} catch (e) {
		throw error(500, `Download failed: ${e}`);
	}
};
