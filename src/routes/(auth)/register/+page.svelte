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
						// The redirect in the server will handle navigation
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
				<div class="relative flex items-center justify-center">
					<Separator.Root class="shrink" />
					<span class="px-2 text-xs text-muted-foreground">OR</span>
					<Separator.Root class="shrink" />
				</div>
				<button
					on:click={() => goto('/login/google')}
					class="flex h-9 w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50"
					disabled={isLoading}
				>
					<img
						src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4="
						alt="Google logo"
						class="h-5 w-5"
					/>
					<span>{$_('sign-in-with-google')}</span>
				</button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
