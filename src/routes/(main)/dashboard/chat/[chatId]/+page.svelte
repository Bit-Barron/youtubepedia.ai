<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let transcript = '';
	let videoUrl = '';
	let question = '';
	let messages: Array<{ type: 'user' | 'bot'; content: string }> = [];
	let loading = false;
	let error = '';

	onMount(() => {
		const chatId = $page.params.chatId;
		const chatData = sessionStorage.getItem(`chat_${chatId}`);

		if (chatData) {
			const data = JSON.parse(chatData);
			transcript = data.transcript;
			videoUrl = data.videoUrl;
		}
	});

	async function handleSubmitQuestion() {
		if (!question.trim()) return;

		loading = true;
		error = '';

		try {
			const response = await fetch('/api/ask', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					transcript,
					question
				})
			});

			const data = await response.json();

			if (data.answer) {
				messages = [
					...messages,
					{ type: 'user', content: question },
					{ type: 'bot', content: data.answer }
				];
				question = '';
			} else {
				error = data.error || 'Failed to get answer';
			}
		} catch (e) {
			error = 'Failed to get answer. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="container mx-auto max-w-4xl p-4">
	<Button variant="ghost" class="mb-4">
		<ArrowLeft class="mr-2 h-4 w-4" />
		Back to Videos
	</Button>

	<div class="flex h-[calc(100vh-8rem)] flex-col">
		<div class="border-b pb-4">
			<h1 class="text-2xl font-bold">Chat about video</h1>
			<p class="overflow-hidden text-ellipsis text-sm text-muted-foreground">
				{videoUrl}
			</p>
		</div>

		<div class="flex-1 space-y-4 overflow-y-auto py-4">
			{#each messages as message}
				<div class="flex {message.type === 'user' ? 'justify-end' : 'justify-start'}">
					<div
						class="max-w-[80%] rounded-lg p-3 {message.type === 'user'
							? 'ml-4 bg-primary text-primary-foreground'
							: 'mr-4 bg-muted'}"
					>
						<p class="whitespace-pre-wrap">{message.content}</p>
					</div>
				</div>
			{/each}
		</div>

		{#if error}
			<Alert variant="destructive" class="mb-4">
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		{/if}

		<div class="border-t pt-4">
			<form class="flex gap-2" on:submit|preventDefault={handleSubmitQuestion}>
				<Input
					type="text"
					placeholder="Type your question..."
					bind:value={question}
					disabled={loading}
					class="flex-1"
				/>
				<Button type="submit" disabled={loading}>
					{loading ? 'Sending...' : 'Send'}
				</Button>
			</form>
		</div>
	</div>
</div>
