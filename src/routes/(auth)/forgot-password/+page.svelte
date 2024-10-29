<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let isSubmitting = false;
	let email = '';
	let message = '';
	let loading = false;

	async function handleSubmit() {
		loading = true;
		try {
			const response = await fetch('/api/forgot-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});
			const data = await response.json();
			message = data.message;
		} catch (error) {
			message = 'An error occurred. Please try again.';
		}
		loading = false;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-2xl">Reset Password</Card.Title>
		<Card.Description>
			Enter your email address and we'll send you instructions to reset your password
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<form class="grid gap-4" on:submit|preventDefault={handleSubmit}>
			<div class="grid gap-2">
				<Label for="email">Email</Label>
				<Input bind:value={email} id="email" type="email" placeholder="m@example.com" required />
			</div>
			<Button type="submit" class="w-full" disabled={isSubmitting}>
				{isSubmitting ? 'Sending...' : 'Send Reset Link'}
			</Button>
			<div class="mt-4 text-center text-sm">
				Remember your password?
				<a href="/login" class="underline">Back to login</a>
			</div>
		</form>
	</Card.Content>
</Card.Root>
