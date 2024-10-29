<script>
	import Navbar from '$lib/components/container/navbar/navbar.svelte';
	import { PlayCircle, Search, MessageCircle } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let videoUrl = '';

	// @ts-ignore
	function handleSubmit(event) {
		event.preventDefault();
		console.log('Submitted URL:', videoUrl);
	}

	onMount(() => {
		document.body.classList.add('dark');
	});

	export let data;

	console.log('asdasd', data);
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
	<Navbar {data} />

	<main class="container mx-auto px-4 py-12">
		<section class="mb-16 text-center">
			<h1 class="mb-6 text-5xl font-bold text-gray-100">
				Ask Anything About <span class="text-purple-400">YouTube Videos</span>
			</h1>
			<p class="mb-8 text-xl text-gray-300">
				Get instant answers to your questions about any YouTube video. Just paste the URL and ask
				away!
			</p>
			<form on:submit={handleSubmit} class="mx-auto flex max-w-2xl gap-4">
				<input
					type="url"
					placeholder="Paste YouTube video URL here"
					bind:value={videoUrl}
					class="flex-grow rounded-md bg-gray-700 px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
				/>
				<button
					type="submit"
					class="flex items-center rounded-md bg-purple-600 px-6 py-2 text-white hover:bg-purple-700"
				>
					<Search class="mr-2 h-4 w-4" /> Analyze
				</button>
			</form>
		</section>

		<section class="mb-16">
			<h2 class="mb-8 text-center text-3xl font-semibold text-gray-100">How It Works</h2>
			<div class="grid gap-8 md:grid-cols-3">
				<div class="rounded-lg bg-gray-800 p-6 shadow-md">
					<div class="mb-4 text-purple-400">
						<PlayCircle class="mx-auto h-12 w-12" />
					</div>
					<h3 class="mb-2 text-center text-xl font-semibold text-gray-100">1. Paste Video URL</h3>
					<p class="text-center text-gray-300">
						Simply copy and paste the URL of any YouTube video you want to inquire about.
					</p>
				</div>
				<div class="rounded-lg bg-gray-800 p-6 shadow-md">
					<div class="mb-4 text-purple-400">
						<Search class="mx-auto h-12 w-12" />
					</div>
					<h3 class="mb-2 text-center text-xl font-semibold text-gray-100">2. Ask Your Question</h3>
					<p class="text-center text-gray-300">
						Type in any question you have about the video's content, context, or details.
					</p>
				</div>
				<div class="rounded-lg bg-gray-800 p-6 shadow-md">
					<div class="mb-4 text-purple-400">
						<MessageCircle class="mx-auto h-12 w-12" />
					</div>
					<h3 class="mb-2 text-center text-xl font-semibold text-gray-100">
						3. Get Instant Answers
					</h3>
					<p class="text-center text-gray-300">
						Receive accurate and informative answers to your questions in seconds.
					</p>
				</div>
			</div>
		</section>

		<section class="mb-16 text-center">
			<h2 class="mb-4 text-3xl font-semibold text-gray-100">Ready to Get Started?</h2>
			<p class="mb-8 text-xl text-gray-300">
				Try VideoInquire now and unlock a new way to interact with YouTube content!
			</p>
			<button class="rounded-md bg-purple-600 px-8 py-3 text-lg text-white hover:bg-purple-700">
				Try It For Free
			</button>
		</section>
	</main>

	<footer class="bg-gray-900 py-8 text-gray-300">
		<div class="container mx-auto px-4">
			<div class="flex flex-col items-center justify-between md:flex-row">
				<div class="mb-4 md:mb-0">
					<h3 class="mb-2 text-2xl font-semibold text-purple-400">VideoInquire</h3>
					<p class="text-gray-400">Empowering curiosity, one video at a time.</p>
				</div>
				<nav>
					<ul class="flex space-x-4">
						<li><a href="#" class="hover:text-purple-400">Privacy Policy</a></li>
						<li><a href="#" class="hover:text-purple-400">Terms of Service</a></li>
						<li><a href="#" class="hover:text-purple-400">Contact Us</a></li>
					</ul>
				</nav>
			</div>
			<div class="mt-8 text-center text-gray-500">
				<p>&copy; {new Date().getFullYear()} VideoInquire. All rights reserved.</p>
			</div>
		</div>
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
			'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	:global(body.dark) {
		background-color: #1a202c;
		color: #f7fafc;
	}
</style>
