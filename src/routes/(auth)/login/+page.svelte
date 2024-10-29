<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	const googleAuth = () => {
		window.location.href = '/login/google';
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form use:enhance method="POST" class="grid gap-4">
			<div class="grid gap-2">
				<Label for="email">Email</Label>
				<Input id="email" name="email" type="email" placeholder="m@example.com" required />
			</div>
			<div class="grid gap-2">
				<div class="flex items-center">
					<Label for="password">Password</Label>
					<a href="/forgot-password" class="ml-auto inline-block text-sm underline">
						Forgot your password?
					</a>
				</div>
				<Input id="password" name="password" type="password" required />
			</div>
			<Button type="submit" class="w-full">Login</Button>
			<Button on:click={googleAuth} variant="outline" class="w-full">Login with Google</Button>
		</form>
		<div class="mt-4 text-center text-sm">
			Don&apos;t have an account?
			<a href="/register" class="underline">Sign up</a>
		</div>
	</Card.Content>
</Card.Root>
