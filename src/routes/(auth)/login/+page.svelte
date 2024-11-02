<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Separator from '$lib/components/ui/separator/index.js';
	import { _ } from 'svelte-i18n';
	import { toast } from 'svelte-sonner';

	let isLoading = false;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-2xl">{$_('login')}</Card.Title>
		<Card.Description>{$_('email-below')}</Card.Description>
	</Card.Header>
	<Card.Content>
		<form
			use:enhance={({}) => {
				isLoading = true;

				return async ({ result, update }) => {
					isLoading = false;

					if (result.type === 'failure') {
						toast.error('Invalid email or password');
						return;
					}

					if (result.type === 'success') {
						toast.success('Logged in successfully!');
						goto('/');
					}

					if (result.type === 'error') {
						toast.error('Something went wrong. Please try again.');
					}

					await update();
				};
			}}
			method="POST"
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
				<div class="flex items-center">
					<Label for="password">{$_('password')}</Label>
					<a href="/forgot-password" class="ml-auto inline-block text-sm underline">
						{$_('forgotten-password')}
					</a>
				</div>
				<Input id="password" name="password" type="password" required />
			</div>
			<div class="grid gap-2">
				<div class="text-end text-sm">
					{$_('no-account')}&nbsp;
					<a href="/register" class="underline">{$_('sign-up')}</a>
				</div>
				<Button type="submit" class="w-full">{$_('login')}</Button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
