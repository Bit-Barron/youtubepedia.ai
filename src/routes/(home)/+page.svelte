<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { AlertCircle, Youtube } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { features } from '../../lib/utils/constants';
	import { _ } from 'svelte-i18n';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	let videoUrl = '';
	let transcriptLoading = false;
	let error = '';

	function validateYoutubeUrl(url: string): boolean {
		try {
			const urlObj = new URL(url);
			return urlObj.hostname.includes('youtube.com') || urlObj.hostname === 'youtu.be';
		} catch {
			return false;
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
					{$_('description')}
				</p>
			</div>

			<Card class="mx-auto mb-16 max-w-2xl border-none shadow-lg">
				<CardContent class="p-6">
					<h2 class="mb-4 text-xl font-semibold">{$_('get-started')}</h2>
					<p class="mb-4 text-gray-400">{$_('youtube-url')}</p>
					<form
						method="POST"
						action="?/getTranscript"
						use:enhance={() => {
							error = '';
							if (!validateYoutubeUrl(videoUrl)) {
								error = 'Please enter a valid YouTube URL';
								return;
							}
							transcriptLoading = true;

							return async ({ result }: any) => {
								transcriptLoading = false;
								if (result.type === 'success') {
									goto(`/dashboard/chat/${result.data?.transcriptId}`);
								} else {
									error = result.data?.message || 'Failed to get transcript';
									toast.error(error);
								}
							};
						}}
					>
						<div class="flex flex-col space-y-4">
							<div class="flex space-x-2">
								<Input
									type="text"
									name="videoUrl"
									placeholder={$_('input-placeholder')}
									bind:value={videoUrl}
									class="flex-grow"
								/>
								<Button
									type="submit"
									variant="destructive"
									disabled={transcriptLoading || !videoUrl}
								>
									{#if transcriptLoading}
										<span class="flex items-center">
											<span
												class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
											></span>
											{$_('processing')}
										</span>
									{:else}
										{$_('get-transcript')}
									{/if}
								</Button>
							</div>

							{#if error}
								<p class="text-sm text-red-500">{error}</p>
							{/if}
						</div>
					</form>

					<div class="mt-4 flex items-center text-sm text-gray-400">
						<AlertCircle class="mr-2 h-4 w-4" />
						<p>{$_('public')}</p>
					</div>
				</CardContent>
			</Card>

			<div class="grid gap-8 md:grid-cols-3">
				{#each features as feature}
					<Card class="border-none">
						<CardContent class="p-6">
							<svelte:component this={feature.icon} class="mb-4 h-10 w-10 text-red-600" />
							<h3 class="mb-2 text-xl font-semibold">{$_(feature.titleKey)}</h3>
							<p class="text-gray-400">{$_(feature.descriptionKey)}</p>
						</CardContent>
					</Card>
				{/each}
			</div>
		</main>

		<footer class="py-8 text-center text-gray-400">
			<p>&copy; 2024 Youtubepedia. {$_('reserved')}.</p>
		</footer>
	</div>
</div>