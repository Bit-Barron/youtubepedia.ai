<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Alert, AlertDescription } from '@/components/ui/alert';
	import type { PageData } from './$types';

	export let data: PageData;

	let question = '';
	let loading = false;
	let answer = '';
	let error = '';

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
</script>

<div class="container mx-auto px-4 py-8">
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
			<form
				method="POST"
				action="?/ask"
				class="flex flex-col space-y-4"
				use:enhance={() => {
					loading = true;
					return async ({ result, update }) => {
						loading = false;
						if (result.type === 'success') {
							answer = (result.data?.answer as string) || '';
							error = '';
							resetForm();
						} else {
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
					/>

					{#if loading}
						<div
							class="inline-flex items-center rounded-md bg-red-600 px-4 py-2 font-semibold text-white opacity-50"
						>
							<span
								class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
								>Processing</span
							>
						</div>
					{:else}
						<div>
							<Button type="submit" variant="destructive">Ask</Button>
						</div>
					{/if}
				</div>

				{#if error}
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				{/if}
			</form>

			{#if answer}
				<div class="mt-6">
					<h3 class="mb-2 font-semibold">Answer:</h3>
					<p class="whitespace-pre-wrap">{answer}</p>
				</div>
			{/if}
		</CardContent>
	</Card>
</div>
