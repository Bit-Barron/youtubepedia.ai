import type { RequestHandler } from '@sveltejs/kit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Groq } from 'groq-sdk';
import prisma from '@/utils/prisma';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groqClient = new Groq({
	apiKey: `${GROQ_API_KEY}`
});

let io: Server;

export const GET: RequestHandler = async () => {
	if (!io) {
		const httpServer = createServer();

		io = new Server(httpServer, {
			cors: {
				origin:
					process.env.NODE_ENV === 'development'
						? 'http://localhost:5173'
						: 'https://youtubepedia.barron.agency',
				methods: ['GET', 'POST'],
				credentials: true
			},
			path: '/api/socket.io'
		});

		io.on('connection', (socket) => {
			console.log('New client connected:', socket.id);

			socket.on('join_room', (transcriptId: string) => {
				console.log(`Client ${socket.id} joining room:`, transcriptId);
				socket.join(transcriptId);
				socket.emit('room_joined', { room: transcriptId });
			});

			socket.on('ask_question', async ({ transcript, question, userId, transcriptId }) => {
				try {
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

					const stream = await groqClient.chat.completions.create({
						messages: [
							{
								role: 'user',
								content: `The following is a transcript of a YouTube video:\n\n${transcript}\n\nBased on the transcript, answer the following question:\n\n${question}\n, give a answer in the same language as the transcript.`
							}
						],
						model: 'llama3-8b-8192',
						stream: true
					});

					let fullAnswer = '';

					for await (const chunk of stream) {
						const content = chunk.choices[0]?.delta?.content || '';
						fullAnswer += content;
						socket.emit('answer_chunk', { content });
					}

					const answerChat = await prisma.chat.create({
						data: {
							id: crypto.randomUUID(),
							userId,
							message: fullAnswer,
							type: 'ANSWER',
							transcriptId,
							createdAt: new Date()
						}
					});

					socket.emit('answer_complete', {
						fullAnswer,
						chats: [questionChat, answerChat]
					});
				} catch (error) {
					console.error('Error processing question:', error);
					socket.emit('error', {
						message: error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten'
					});
				}
			});

			socket.on('disconnect', () => {
				console.log('Client disconnected:', socket.id);
			});
		});

		httpServer.listen(3001);
	}

	return new Response('WebSocket server is running');
};
