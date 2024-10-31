import type { ViteDevServer } from 'vite';
import { Server } from 'socket.io';
import { Groq } from 'groq-sdk';

console.log(process.env.GROQ_API_KEY);

const groqClient = new Groq({
	apiKey: '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'
});

export const createWebSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);

		io.on('connection', async (socket) => {
			console.log('Client connected');

			socket.on('askQuestion', async (data) => {
				try {
					console.log('Received question:', data.question);

					if (!data.transcript || !data.question) {
						throw new Error('Missing transcript or question');
					}

					const stream = await groqClient.chat.completions.create({
						messages: [
							{
								role: 'user',
								content: `The following is a transcript of a YouTube video:\n\n${data.transcript}\n\nBased on the transcript, answer the following question:\n\n${data.question}\n, give a answer in the same language as the transcript.`
							}
						],
						model: 'llama3-8b-8192',
						stream: true
					});

					socket.emit('stream-start');

					for await (const chunk of stream) {
						const content = chunk.choices[0]?.delta?.content;
						if (content) {
							socket.emit('stream-chunk', {
								status: 'success',
								chunk: content
							});
						}
					}

					socket.emit('stream-end');
				} catch (error) {
					console.error('Error processing question:', error);
					socket.emit('answer', {
						status: 'error',
						message: error instanceof Error ? error.message : 'Failed to process question'
					});
				}
			});

			socket.on('disconnect', () => {
				console.log('Client disconnected');
			});
		});
	}
};
