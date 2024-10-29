<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { AlertCircle, Loader2 } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let videoUrl = '';
	let transcriptLoading = false;

	async function handleTranscript() {
		try {
			transcriptLoading = true;
			const response = await fetch('/api/transcript', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ video_url: videoUrl })
			});

			if (!response.ok) {
				throw new Error('Failed to get transcript');
			}

			const data = await response.json();

			const chatId = Math.random().toString(36).substring(2, 15);

			sessionStorage.setItem(
				`chat_${chatId}`,
				JSON.stringify({
					transcript: data.transcript,
					videoUrl: videoUrl
				})
			);

			goto(`/dashboard/chat/${chatId}`);
		} catch (error) {
			console.error('Error:', error);
			alert('Failed to get transcript: ' + error);
		} finally {
			transcriptLoading = false;
		}
	}
</script>

<div class="container mx-auto p-4">
	<Card>
		<CardHeader>
			<CardTitle>YouTube Transcript Assistant</CardTitle>
			<CardDescription>
				Get the transcript from any YouTube video and ask questions about its content
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-6">
			<div class="flex flex-col gap-4 sm:flex-row">
				<Input
					type="text"
					placeholder="Paste your YouTube video URL here..."
					bind:value={videoUrl}
				/>
				<Button on:click={handleTranscript} disabled={transcriptLoading || !videoUrl}>
					{#if transcriptLoading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Processing...
					{:else}
						Get Transcript
					{/if}
				</Button>
			</div>

			<Alert>
				<AlertCircle class="h-4 w-4" />
				<AlertDescription>
					The video must be public and have closed captions available. After processing, you'll be
					able to chat with an AI assistant about the video content.
				</AlertDescription>
			</Alert>
		</CardContent>
	</Card>
</div>
