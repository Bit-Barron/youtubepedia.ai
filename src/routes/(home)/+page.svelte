<script>
	import { PlayCircle, Search, MessageCircle } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { goto } from '$app/navigation';

	let videoUrl = '';
	let loading = false;
	let error = '';

	const handleAnalyze = async () => {
		loading = true;
		error = '';
		try {
			const response = await fetch('http://localhost:5000/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					video_url: videoUrl
				})
			});

			const data = await response.json();
			if (data.error) {
				error = data.error;
			} else {
				// Generate a unique chat ID
				const chatId = crypto.randomUUID();
				// Store the data in localStorage
				localStorage.setItem(
					`chat_${chatId}`,
					JSON.stringify({
						videoUrl,
						transcript: data.transcript,
						messages: []
					})
				);
				// Redirect to chat page
				goto(`/dashboard/chat/${chatId}`);
			}
		} catch (e) {
			error = 'Failed to analyze video. Please try again.';
		} finally {
			loading = false;
		}
	};
</script>

<div class="min-h-screen">
	<main class="container mx-auto px-4 py-12">
		<section class="mb-16 text-center">
			<h1 class="mb-6 scroll-m-20 text-5xl font-bold tracking-tight">
				Ask Anything About <span class="font-extrabold">YouTube Videos</span>
			</h1>
			<p class="mb-8 text-xl leading-7 text-muted-foreground">
				Get instant answers to your questions about any YouTube video.
			</p>

			<form class="mx-auto flex max-w-2xl gap-4" on:submit|preventDefault={handleAnalyze}>
				<Input
					type="url"
					placeholder="Paste YouTube video URL here"
					bind:value={videoUrl}
					class="flex-grow"
					disabled={loading}
				/>
				<Button type="submit" variant="default" disabled={loading}>
					<Search class="mr-2 h-4 w-4" />
					{loading ? 'Analyzing...' : 'Analyze'}
				</Button>
			</form>

			{#if error}
				<Alert variant="destructive" class="mt-4">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			{/if}
		</section>

		<section class="mb-16">
			<h2 class="mb-8 scroll-m-20 text-center text-3xl font-semibold tracking-tight">
				How It Works
			</h2>
			<div class="grid gap-8 md:grid-cols-3">
				<Card>
					<CardHeader>
						<div class="mb-4 flex justify-center">
							<PlayCircle class="h-12 w-12" />
						</div>
						<CardTitle class="text-center">1. Paste Video URL</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="text-center text-muted-foreground">
							Simply copy and paste the URL of any YouTube video you want to inquire about.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div class="mb-4 flex justify-center">
							<Search class="h-12 w-12" />
						</div>
						<CardTitle class="text-center">2. Ask Your Question</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="text-center text-muted-foreground">
							Type in any question you have about the video's content, context, or details.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div class="mb-4 flex justify-center">
							<MessageCircle class="h-12 w-12" />
						</div>
						<CardTitle class="text-center">3. Get Instant Answers</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="text-center text-muted-foreground">
							Receive accurate and informative answers to your questions in seconds.
						</p>
					</CardContent>
				</Card>
			</div>
		</section>

		<section class="mb-16 text-center">
			<h2 class="mb-4 scroll-m-20 text-3xl font-semibold tracking-tight">Ready to Get Started?</h2>
			<p class="mb-8 text-xl text-muted-foreground">
				Try Youtubepedia now and unlock a new way to interact with YouTube content!
			</p>
			<Button size="lg" variant="default">Try It For Free</Button>
		</section>
	</main>

	<Separator />

	<footer class="py-8">
		<div class="container mx-auto px-4">
			<div class="flex flex-col items-center justify-between md:flex-row">
				<div class="mb-4 md:mb-0">
					<h3 class="mb-2 scroll-m-20 text-2xl font-semibold tracking-tight">Youtubepedia</h3>
					<p class="text-muted-foreground">Empowering curiosity, one video at a time.</p>
				</div>
				<nav>
					<ul class="flex space-x-4">
						<li><Button variant="link" href="/policy">Privacy Policy</Button></li>
						<li><Button variant="link" href="/terms">Terms of Service</Button></li>
						<li><Button variant="link" href="/contact">Contact Us</Button></li>
					</ul>
				</nav>
			</div>
			<Separator class="my-8" />
			<div class="text-center">
				<p class="text-sm text-muted-foreground">
					&copy; {new Date().getFullYear()} Youtubepedia. All rights reserved.
				</p>
			</div>
		</div>
	</footer>
</div>
