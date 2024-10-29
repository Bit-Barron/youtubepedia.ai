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
	import { Loader2 } from 'lucide-svelte';
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

<div class="container mx-auto space-y-8 p-4">
	<Card>
		<CardHeader>
			<CardTitle>YouTube Transcript Assistant</CardTitle>
			<CardDescription>Get transcript and ask questions about YouTube videos</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="flex gap-4">
				<Input type="text" placeholder="Enter YouTube video URL" bind:value={videoUrl} />
				<Button on:click={handleTranscript} disabled={transcriptLoading}>
					{#if transcriptLoading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Get Transcript
				</Button>
			</div>
		</CardContent>
	</Card>
</div>
