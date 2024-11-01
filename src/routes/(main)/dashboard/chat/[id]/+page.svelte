<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Alert, AlertDescription } from '@/components/ui/alert';
	import type { PageData } from './$types';
	import { initSocket } from '$lib/socket';
	import { onMount, onDestroy } from 'svelte';
	import type { Socket } from 'socket.io-client';
	import AnimatedText from '@/components/elements/animated-text.svelte';
	import { text } from '@sveltejs/kit';

	export let data: PageData;

	let question = '';
	let loading = false;
	let answer = '';
	let error = '';
	let socket: Socket | null = null;
	let chats = data.transcript.chats || [];
	let isAnimatingAnswer = false;

	onMount(() => {
		if (data.userId) {
			socket = initSocket(data.userId);

			socket?.on('connect', () => {
				console.log('Connected to chat server');
			});

			socket?.on('connect_error', (error) => {
				console.error('Connection error:', error);
			});

			socket?.on('new-question', (chat) => {
				console.log('New question received:', chat);
				chats = [...chats, chat];
			});

			socket?.on('new-answer', (chat) => {
				console.log('New answer received:', chat);
				chats = [...chats, { ...chat, isAnimating: true }];
				answer = chat.message;
				isAnimatingAnswer = true;
			});
		}
	});

	onDestroy(() => {
		if (socket) {
			console.log('Disconnecting socket');
			socket.disconnect();
			socket = null;
		}
	});

	function handleSubmit(e: Event) {
		if (!question.trim()) {
			error = 'Please enter a question';
			return;
		}
		loading = true;
		error = '';
	}

	function resetForm() {
		question = '';
		loading = false;
	}

	function handleAnimationComplete(chatId: string) {
		chats = chats.map((chat) => (chat.id === chatId ? { ...chat, isAnimating: false } : chat));
		if (chats[chats.length - 1]?.id === chatId) {
			isAnimatingAnswer = false;
			loading = false;
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<Card class="mb-8">
		<CardContent class="p-6">
			<h2 class="mb-4 text-xl font-semibold">Transcript</h2>
			<div
				class="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg border border-gray-200 p-4"
			>
				{data.transcript.content}
			</div>
		</CardContent>
	</Card>

	<Card class="mb-8">
		<CardContent class="p-6">
			<h2 class="mb-4 text-xl font-semibold">Chat History</h2>
			<div class="space-y-4">
				{#each chats as chat (chat.id)}
					<div class="rounded-lg p-4 shadow-sm transition-colors duration-200">
						<p class="font-semibold">
							{chat.type === 'QUESTION' ? '❓ Question:' : '💡 Answer:'}
						</p>
						<p class="mt-2">
							{#if chat.type === 'ANSWER'}
								<span>{chat.message}</span>
							{:else}
								<span class="whitespace-pre-wrap">{chat.message}</span>
							{/if}
						</p>
						<p class="mt-2 text-sm text-gray-500">
							{new Date(chat.createdAt).toLocaleString()}
						</p>
					</div>
				{/each}
			</div>
		</CardContent>
	</Card>

	<Card>
		<CardContent class="p-6">
			<h2 class="mb-4 text-xl font-semibold">Ask a Question</h2>
			<form
				method="POST"
				action="?/ask"
				class="flex flex-col space-y-4"
				use:enhance={() => {
					loading = true;
					return async ({ result, update }) => {
						if (result.type === 'success') {
							error = '';
							resetForm();
						} else {
							loading = false;
							error = 'Failed to get answer';
							if ('data' in result) {
								error =
									typeof result.data?.message === 'string'
										? result.data.message
										: 'Failed to get answer';
							}
							if (error.includes('too long') || error.includes('context_length_exceeded')) {
								error =
									'The transcript is too long to process. Please try breaking your question into smaller parts or focus on a specific section.';
							}
						}
						await update();
					};
				}}
			>
				<input type="hidden" name="transcriptId" value={data.transcript.id} />
				<input type="hidden" name="transcript" value={data.transcript.content} />

				<div class="flex space-x-2">
					<Input
						type="text"
						name="question"
						bind:value={question}
						placeholder="Ask a question about the video..."
						class="flex-grow"
						disabled={loading || isAnimatingAnswer}
					/>

					{#if loading || isAnimatingAnswer}
						<div
							class="inline-flex items-center rounded-md bg-red-600 px-4 py-2 font-semibold text-white opacity-50"
						>
							<span
								class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
								><span>Processing...</span></span
							>
						</div>
					{:else}
						<Button type="submit" variant="destructive" disabled={!question.trim()}>Ask</Button>
					{/if}
				</div>

				{#if error}
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				{/if}
			</form>
		</CardContent>
	</Card>
</div>
