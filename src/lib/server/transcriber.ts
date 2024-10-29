import { YoutubeTranscript } from 'youtube-transcript';

export async function downloadTranscript(videoUrl: string): Promise<string> {
	try {
		const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
		return transcript.map((item) => item.text).join(' ');
	} catch (error) {
		console.error('Error downloading transcript:', error);
		throw new Error(`Failed to download transcript: ${error}`);
	}
}
