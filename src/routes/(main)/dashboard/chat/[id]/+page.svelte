<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Alert, AlertDescription } from '@/components/ui/alert';
	import type { PageData } from './$types';
	import { onMount, onDestroy } from 'svelte';
	import { io, type Socket } from 'socket.io-client';

	export let data: PageData;

	let question = '';
	let loading = false;
	let answer = '';
	let error = '';
	let socket: Socket;
	let connectionStatus = 'disconnected';

	function initializeSocket() {
		socket = io();

		socket.on('connect', () => {
			connectionStatus = 'connected';
			error = '';
			console.log('Connected to server');
		});

		socket.on('stream-start', () => {
			loading = true;
			answer = '';
			error = '';
		});

		socket.on('stream-chunk', (response) => {
			if (response.status === 'success') {
				answer += response.chunk;
			} else {
				error = response.message || 'Failed to get answer';
			}
		});

		socket.on('stream-end', () => {
			loading = false;
		});

		socket.on('error', (err) => {
			loading = false;
			error = err.message || 'An error occurred';
			console.error('Socket error:', err);
		});

		socket.on('disconnect', () => {
			connectionStatus = 'disconnected';
			console.log('Disconnected from server');
		});
	}

	onMount(() => {
		initializeSocket();
	});

	onDestroy(() => {
		if (socket) {
			socket.disconnect();
		}
	});

	async function askQuestion() {
		if (!question || connectionStatus !== 'connected') return;

		loading = true;
		error = '';
		answer = '';

		try {
			socket.emit('askQuestion', {
				transcript: data.transcript.content,
				question
			});
		} catch (err) {
			loading = false;
			error = 'Failed to send question';
			console.error('Error sending question:', err);
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	{#if connectionStatus !== 'connected'}
		<Alert variant="destructive" class="mb-4">
			<AlertDescription>Connecting to server...</AlertDescription>
		</Alert>
	{/if}

	<Card class="mb-8">
		<CardContent class="p-6">
			<h2 class="mb-4 text-xl font-semibold">Transcript</h2>
			<div class="max-h-64 overflow-y-auto whitespace-pre-wrap">
				{data.transcript.content}
			</div>
		</CardContent>
	</Card>

	<Card>
		<CardContent class="p-6">
			<h2 class="mb-4 text-xl font-semibold">Ask a Question</h2>
			<div class="flex flex-col space-y-4">
				<div class="flex space-x-2">
					<Input
						type="text"
						name="question"
						placeholder="Ask a question about the video..."
						bind:value={question}
						class="flex-grow"
						disabled={connectionStatus !== 'connected'}
					/>
					{#if loading}
						<div
							class="inline-flex items-center rounded-md bg-red-600 px-4 py-2 font-semibold text-white opacity-50"
						>
							<span
								class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
							></span>
							Processing
						</div>
					{:else}
						<Button
							type="button"
							variant="destructive"
							disabled={!question || connectionStatus !== 'connected'}
							on:click={askQuestion}
						>
							Ask
						</Button>
					{/if}
				</div>

				{#if error}
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				{/if}
			</div>

			{#if answer}
				<div class="mt-6">
					<h3 class="mb-2 font-semibold">Answer:</h3>
					<p class="whitespace-pre-wrap">{answer}</p>
				</div>
			{/if}
		</CardContent>
	</Card>
</div>
