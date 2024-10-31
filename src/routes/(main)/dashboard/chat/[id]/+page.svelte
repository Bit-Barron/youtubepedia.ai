<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent } from '$lib/components/ui/card';
	import type { PageData } from './$types';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import io from 'socket.io-client';

	export let data: any;

	let question = '';
	let loading = false;
	let answer = '';
	let error = '';
	let socket: any;
	let connected = false;
	let reconnectAttempts = 0;
	const MAX_RECONNECT_ATTEMPTS = 5;

	let chats = data.transcript.chats || [];

	function initializeSocket() {
		if (!browser) return;

		const isDev = import.meta.env.DEV;
		const socketPort = isDev ? ':3000' : '';
		const socketUrl = `${window.location.protocol}//${window.location.hostname}${socketPort}`;
		socket = io(socketUrl, {
			path: '/socket.io',
			transports: ['polling', 'websocket'],
			reconnection: true,
			reconnectionAttempts: 5
		});

		socket.on('connect', () => {
			console.log('Socket connected with ID:', socket.id);
			connected = true;
			error = '';
			reconnectAttempts = 0;
			socket.emit('join_room', data.transcript.id);
		});

		socket.on('connect_error', (err: { message: any }) => {
			console.error('Connection Details:', {
				error: err,
				transport: socket.io?.engine?.transport?.name,
				url: socketUrl,
				path: socket.io?.opts?.path,
				readyState: socket.io?.engine?.transport?.ws?.readyState
			});
			reconnectAttempts++;
			error = `Verbindungsfehler: ${err.message}. Versuche erneut zu verbinden...`;
			connected = false;
			loading = false;
		});
		socket.on('disconnect', (reason: string) => {
			console.log('Disconnected:', reason);
			connected = false;
			if (reason === 'io server disconnect') {
				socket.connect();
			}
		});

		socket.on('answer_chunk', (data: { content: string }) => {
			answer += data.content;
		});

		socket.on('answer_complete', ({ chats: newChats }: { chats: any[] }) => {
			loading = false;
			chats = [...chats, ...newChats];
		});

		socket.on('error', (data: { message: string }) => {
			error = data.message;
			loading = false;
		});
	}

	onMount(() => {
		initializeSocket();
	});

	onDestroy(() => {
		if (socket) {
			console.log('Cleaning up socket connection');
			socket.disconnect();
		}
	});

	function handleSubmit() {
		if (!question || loading || !socket || !connected) return;

		loading = true;
		error = '';
		answer = '';

		socket.emit('ask_question', {
			transcript: data.transcript.content,
			question,
			userId: data.transcript.userId,
			transcriptId: data.transcript.id
		});
	}
</script>

<div class="container mx-auto px-4 py-8">
	{#if !connected}
		<div class="mb-4 rounded-md bg-yellow-50 p-4">
			<p class="flex items-center text-yellow-700">
				<span class="mr-2 h-2 w-2 animate-pulse rounded-full bg-yellow-500"></span>
				Verbindung zum Server wird hergestellt... {#if reconnectAttempts > 0}(Versuch {reconnectAttempts}/{MAX_RECONNECT_ATTEMPTS}){/if}
			</p>
		</div>
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
						bind:value={question}
						placeholder="Ask a question about the video..."
						class="flex-grow"
						disabled={!connected}
						on:keydown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
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
						<div>
							<Button
								type="button"
								variant="destructive"
								disabled={!question || !connected}
								on:click={handleSubmit}
							>
								Ask
							</Button>
						</div>
					{/if}
				</div>

				{#if error}
					<p class="text-sm text-red-500">{error}</p>
				{/if}
			</div>

			{#if answer}
				<div class="mt-6">
					<h3 class="mb-2 font-semibold">Current Answer:</h3>
					<p class="whitespace-pre-wrap">{answer}</p>
				</div>
			{/if}
		</CardContent>
	</Card>
</div>
