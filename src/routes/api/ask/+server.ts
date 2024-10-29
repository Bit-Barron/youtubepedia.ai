import { error, json } from '@sveltejs/kit';
import { Groq } from 'groq-sdk';
import type { RequestHandler } from './$types';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groqClient = new Groq({
	apiKey: GROQ_API_KEY
});

if (!process.env.GROQ_API_KEY) {
	console.warn('Warning: GROQ_API_KEY is not set. Defaulting to a dummy key.');
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { transcript, question } = await request.json();

		if (!transcript || !question) {
			throw error(400, 'Missing transcript or question');
		}

		const completion = await groqClient.chat.completions.create({
			messages: [
				{
					role: 'user',
					content: `The following is a transcript of a YouTube video:\n\n${transcript}\n\nBased on the transcript, answer the following question:\n\n${question}\n`
				}
			],
			model: 'llama3-8b-8192'
		});

		const answer = completion!.choices[0]!.message!.content!.trim();
		return json({ answer });
	} catch (e) {
		throw error(500, `Chat completion failed: ${e}`);
	}
};
