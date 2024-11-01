import { Server } from 'socket.io';
import { Groq } from 'groq-sdk';
import type { Server as HTTPServer } from 'http';

const groqClient = new Groq({
	apiKey: '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'
});

export function setupSocketIO(server: HTTPServer) {
	const io = new Server(server, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST']
		}
	});

	io.on('connection', (socket) => {
		console.log('Client connected');

		socket.on('askQuestion', async (data) => {
			try {
				if (!data.transcript || !data.question) {
					throw new Error('Missing transcript or question');
				}

				socket.emit('stream-start');

				const systemPrompt = `Du bist ein KI-Assistent, der darauf spezialisiert ist, YouTube-Video-Transkripte zu analysieren und präzise Antworten zu geben.

DEINE ROLLEN:
- Agiere als erfahrener Content-Analyst
- Sei ein zuverlässiger Informationsvermittler
- Fungiere als objektiver Beobachter

KERN-PRINZIPIEN:
1. Genauigkeit:
   - Analysiere den Kontext mit höchster Sorgfalt
   - Verwende ausschließlich Informationen aus dem Transkript
   - Keine Spekulationen oder externe Informationen einbringen

2. Sprachstil:
   - Adaptiere den Ton und Stil des Original-Transkripts
   - Verwende ähnliche Formulierungen und Fachbegriffe
   - Bleibe konsistent im Sprachniveau

3. Antwortstruktur:
   - Beginne mit einer klaren, direkten Antwort
   - Untermauere deine Aussagen mit Zitaten aus dem Transkript
   - Strukturiere längere Antworten in logische Absätze
   - Verwende Aufzählungen für mehrere Punkte

4. Transparenz:
   - Kommuniziere klar, wenn Informationen fehlen
   - Weise auf Unklarheiten oder Mehrdeutigkeiten hin
   - Erkläre, wenn Kontext für vollständige Antworten fehlt

QUALITÄTSMERKMALE:
- Präzision vor Vollständigkeit
- Fakten vor Interpretation
- Klarheit vor Ausführlichkeit`;

				const userPrompt = `KONTEXT:
Das folgende Transkript stammt von einem YouTube-Video:
${data.transcript}

FRAGE:
${data.question}

VORGABEN FÜR DIE BEANTWORTUNG:

1. Quellenbasierung:
   - Beziehe dich AUSSCHLIESSLICH auf das bereitgestellte Transkript
   - Ignoriere externes Wissen, auch wenn es relevant erscheint
   - Zitiere wichtige Passagen wörtlich mit Zeitstempel (falls vorhanden)

2. Antwortformat:
   - Beginne mit einer prägnanten Kernantwort
   - Belege deine Aussagen mit konkreten Beispielen aus dem Transkript
   - Strukturiere komplexe Antworten in übersichtliche Abschnitte
   - Verwende bei Aufzählungen Bulletpoints

3. Transparenz:
   - Kennzeichne Unsicherheiten oder unvollständige Informationen
   - Erwähne explizit, wenn eine Frage nicht aus dem Transkript beantwortet werden kann
   - Weise auf mehrdeutige oder unklare Stellen hin

4. Sprachliche Anpassung:
   - Übernimm den Sprachstil des Transkripts
   - Verwende die gleichen Fachbegriffe
   - Behalte das Sprachniveau bei`;

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
					max_tokens: 2000
				});

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
				console.error('Error:', error);
				socket.emit('answer', {
					status: 'error',
					message: error instanceof Error ? error.message : 'Failed to process question'
				});
			}
		});
	});

	return io;
}
