<script>
	import { PlayCircle, Search, MessageCircle } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';

	let videoUrl = '';
</script>

<div class="min-h-screen">
	<main class="container mx-auto px-4 py-12">
		<section class="mb-16 text-center">
			<h1 class="mb-6 scroll-m-20 text-5xl font-bold tracking-tight">
				Ask Anything About <span class="font-extrabold">YouTube Videos</span>
			</h1>
			<p class="mb-8 text-xl leading-7 text-muted-foreground">
				Get instant answers to your questions about any YouTube video. Just paste the URL and ask
				away!
			</p>
			<form class="mx-auto flex max-w-2xl gap-4">
				<Input
					type="url"
					placeholder="Paste YouTube video URL here"
					bind:value={videoUrl}
					class="flex-grow"
				/>
				<Button type="submit" variant="default">
					<Search class="mr-2 h-4 w-4" />
					Analyze
				</Button>
			</form>
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
				Try VideoInquire now and unlock a new way to interact with YouTube content!
			</p>
			<Button size="lg" variant="default">Try It For Free</Button>
		</section>
	</main>

	<Separator />

	<footer class="py-8">
		<div class="container mx-auto px-4">
			<div class="flex flex-col items-center justify-between md:flex-row">
				<div class="mb-4 md:mb-0">
					<h3 class="mb-2 scroll-m-20 text-2xl font-semibold tracking-tight">VideoInquire</h3>
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
					&copy; {new Date().getFullYear()} VideoInquire. All rights reserved.
				</p>
			</div>
		</div>
	</footer>
</div>
