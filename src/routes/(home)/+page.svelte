<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { Search } from 'lucide-svelte';
	import Navbar from '$lib/components/container/navbar/navbar.svelte';

	let query = '';
	let examples = [
		'What is the best way to grow plants indoors?',
		'What are some of the best cameras in 2024?',
		'Most memorable Olympic moments.',
		'What are the health benefits of green tea?',
		'Summarize https://www.youtube.com/watch?v=ms6Kxcdcsbc'
	];

	export let data;

	console.log(data);
</script>

<div class="min-h-screen bg-gradient-to-br font-sans text-white">
	<Navbar />

	<main class="container mx-auto px-4 py-16 text-center">
		<h1 in:fly={{ y: -50, duration: 500 }} class="mb-8 text-6xl font-bold">
			Ask <span class="text-red-500">YouTube</span>
		</h1>

		<div in:fly={{ y: 50, duration: 500, delay: 200 }} class="mx-auto max-w-2xl">
			<div class="relative">
				<input
					type="text"
					placeholder="Ask YouTube anything..."
					bind:value={query}
					class="w-full rounded-full bg-gray-700 px-4 py-3 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
				/>
				<button
					class="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-red-500 p-2 text-white transition-colors duration-200 hover:bg-red-600"
				>
					<Search class="h-5 w-5" />
				</button>
			</div>
		</div>

		<div in:fade={{ duration: 500, delay: 400 }} class="mt-12">
			<h2 class="mb-4 text-xl font-semibold">Examples:</h2>
			<ul class="space-y-2">
				{#each examples as example}
					<li
						class="transform cursor-pointer text-gray-300 transition-all duration-200 hover:scale-105 hover:text-white"
					>
						{example} <span class="text-red-500">Ask</span>
					</li>
				{/each}
			</ul>
		</div>
	</main>

	<footer class="absolute bottom-0 w-full p-4 text-center text-gray-400">
		<p>
			© 2024 - AskYoutube - <a href="/support" class="hover:underline">Support</a> -
			<a href="/pricing" class="hover:underline">Pricing</a>
			- <a href="/privacy" class="hover:underline">Privacy</a>
		</p>
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu,
			Cantarell, 'Helvetica Neue', sans-serif;
	}
</style>
