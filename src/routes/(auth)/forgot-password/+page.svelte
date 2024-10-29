<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { toast } from 'svelte-sonner';
	import { _ } from 'svelte-i18n';

	let isSubmitting = false;
	let email = '';
	let message = '';
	let loading = false;

	async function handleSubmit() {
		loading = true;
		try {
			const response = await fetch('/api/auth/forgot-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});
			const data = await response.json();
			message = data.message;
			toast.success(message);

			return goto('/login');
		} catch (error) {
			message = 'An error occurred. Please try again.';
		}
		loading = false;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-2xl">{$_('reset-password')}</Card.Title>
		<Card.Description>
			{$_('reset-password')}
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
				{$_('remember-your-password')}
				<a href="/login" class="underline">{$_('back-to-login')}</a>
			</div>
		</form>
	</Card.Content>
</Card.Root>
