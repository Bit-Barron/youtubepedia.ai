<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { AlertCircle, Youtube } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { features } from '../../lib/utils/constants';
	import { _ } from 'svelte-i18n';

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

<div class="min-h-screen">
	<div class="container mx-auto px-4">
		<main class="py-16">
			<div class="mb-12 text-center">
				<div class="mb-6 inline-block rounded-full bg-red-600 p-2">
					<Youtube class="h-8 w-8" />
				</div>
				<h1 class="mb-4 text-4xl font-bold">YouTube Transcript Assistant</h1>
				<p class="mx-auto max-w-2xl text-xl text-gray-400">
					Transform any YouTube video into an interactive conversation. Get instant access to
					transcripts and chat about the content with AI assistance.
				</p>
			</div>

			<Card class="mx-auto mb-16 max-w-2xl border-none shadow-lg">
				<CardContent class="p-6">
					<h2 class="mb-4 text-xl font-semibold">Get Started</h2>
					<p class="mb-4 text-gray-400">Enter your YouTube video URL below to begin the analysis</p>
					<div class="flex space-x-2">
						<Input
							type="text"
							placeholder="Paste your YouTube video URL here..."
							bind:value={videoUrl}
							class="flex-grow"
						/>
						<Button
							on:click={handleTranscript}
							variant="destructive"
							disabled={transcriptLoading || !videoUrl}
						>
							{#if transcriptLoading}
								Processing...
							{:else}
								Get Transcript
							{/if}
						</Button>
					</div>

					<div class="mt-4 flex items-center text-sm text-gray-400">
						<AlertCircle class="mr-2 h-4 w-4" />
						<p>The video must be public and have closed captions available.</p>
					</div>
				</CardContent>
			</Card>

			<div class="grid gap-8 md:grid-cols-3">
				{#each features as feature}
					<Card class="border-none">
						<CardContent class="p-6">
							<svelte:component this={feature.icon} class="mb-4 h-10 w-10 text-red-600" />
							<h3 class="mb-2 text-xl font-semibold">{feature.title}</h3>
							<p class="text-gray-400">{feature.description}</p>
						</CardContent>
					</Card>
				{/each}
			</div>
		</main>

		<footer class="py-8 text-center text-gray-400">
			<p>&copy; 2024 Youtubepedia. All rights reserved.</p>
		</footer>
	</div>
</div>
