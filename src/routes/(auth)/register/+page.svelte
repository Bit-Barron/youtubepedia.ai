<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Separator from '$lib/components/ui/separator/index.js';
	import { toast } from 'svelte-sonner';
	import { _ } from 'svelte-i18n';

	let isLoading = false;
</script>

<Card.Root class="mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-xl">Sign Up</Card.Title>
		<Card.Description>{$_('email_below')}</Card.Description>
	</Card.Header>
	<Card.Content>
		<form
			method="POST"
			use:enhance={({}) => {
				isLoading = true;

				return async ({ result, update }) => {
					isLoading = false;

					if (result.type === 'failure') {
						toast.error('An account with this email already exists');
						return;
					}

					if (result.type === 'success') {
						toast.success('Account created successfully!');
					}

					if (result.type === 'error') {
						toast.error('Something went wrong. Please try again.');
					}

					await update();
				};
			}}
			class="grid gap-4"
		>
			<div class="grid gap-2">
				<Label for="email">Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					placeholder={$_('email-placeholder')}
					required
				/>
			</div>
			<div class="grid gap-2">
				<Label for="password">Password</Label>
				<Input id="password" name="password" type="password" required />
			</div>
			<div class="grid gap-2">
				<div class="text-end text-sm">
					Already have an account?
					<a href="/login" class="underline">Sign in</a>
				</div>
				<Button type="submit" class="w-full" disabled={isLoading}>
					{#if isLoading}
						Creating account...
					{:else}
						Create an account
					{/if}
				</Button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
