<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent } from '$lib/components/ui/card';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;

	let question = '';
	let loading = false;
	let answer = '';
	let error = '';
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
				use:enhance={() => {
					loading = true;
					error = '';

					return async ({ result }: any) => {
						loading = false;
						if (result.type === 'success') {
							answer = result.data.answer;
							question = '';
						} else {
							error = result.data?.message || 'Failed to get answer';
						}
					};
				}}
			>
				<input type="hidden" name="transcript" value={data.transcript.content} />
				<div class="flex flex-col space-y-4">
					<div class="flex space-x-2">
						<Input
							type="text"
							name="question"
							placeholder="Ask a question about the video..."
							bind:value={question}
							class="flex-grow"
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
							<Button type="submit" variant="destructive" disabled={!question}>Ask</Button>
						{/if}
					</div>

					{#if error}
						<p class="text-sm text-red-500">{error}</p>
					{/if}
				</div>
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
