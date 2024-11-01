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

					const systemPrompt = `Du bist ein hilfreicher Assistent, der Fragen zu YouTube-Video-Transkripten beantwortet. 
                    - Analysiere den Kontext sorgfältig
                    - Beziehe dich spezifisch auf den Inhalt des Videos
                    - Antworte präzise und faktenbasiert
                    - Verwende den gleichen Sprachstil wie im Transkript
                    - Bei Unklarheiten erwähne, dass bestimmte Details möglicherweise nicht im Transkript enthalten sind
                    - Strukturiere längere Antworten mit Absätzen für bessere Lesbarkeit`;

					const userPrompt = `Kontext: Das folgende ist ein Transkript eines YouTube-Videos:

${data.transcript}

Basierend auf diesem Transkript, beantworte bitte diese Frage:
${data.question}

Wichtig:
1. Beziehe dich nur auf Informationen aus dem Transkript
2. Wenn die Antwort nicht im Transkript zu finden ist, sage das ehrlich
3. Verwende den gleichen Sprachstil wie im Transkript
4. Zitiere wenn möglich relevante Passagen aus dem Transkript`;

					const stream = await groqClient.chat.completions.create({
						messages: [
							{
								role: 'system',
								content: systemPrompt
							},
							{
								role: 'user',
								content: userPrompt
							}
						],
						model: 'llama3-8b-8192',
						stream: true,
						temperature: 0.7,
						max_tokens: 2000,
						top_p: 0.9
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
