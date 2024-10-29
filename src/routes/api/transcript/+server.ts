import { error, json } from '@sveltejs/kit';
import { downloadTranscript } from '$lib/server/transcriber';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { video_url } = await request.json();
		if (!video_url) {
			throw error(400, 'Video URL is required');
		}

		const transcript = await downloadTranscript(video_url);
		return json({ transcript });
	} catch (e) {
		throw error(500, `An error occurred: ${e}`);
	}
};
