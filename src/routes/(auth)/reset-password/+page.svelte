<script lang="ts">
	import { page } from '$app/stores';

	let password = '';
	let confirmPassword = '';
	let message = '';
	let loading = false;

	const token = $page.url.searchParams.get('token');

	async function handleSubmit() {
		if (password !== confirmPassword) {
			message = 'Passwords do not match';
			return;
		}

		loading = true;
		try {
			const response = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, password })
			});
			const data = await response.json();
			message = data.message;

			if (response.ok) {
				setTimeout(() => {
					window.location.href = '/login';
				}, 2000);
			}
		} catch (error) {
			message = 'An error occurred. Please try again.';
		}
		loading = false;
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="mx-auto mt-8 max-w-md space-y-6">
	<h1 class="text-2xl font-bold">Reset Password</h1>

	<div>
		<label for="password" class="block text-sm font-medium text-gray-700">New Password</label>
		<input
			type="password"
			id="password"
			bind:value={password}
			required
			minlength="8"
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
		/>
	</div>

	<div>
		<label for="confirmPassword" class="block text-sm font-medium text-gray-700"
			>Confirm Password</label
		>
		<input
			type="password"
			id="confirmPassword"
			bind:value={confirmPassword}
			required
			minlength="8"
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
		/>
	</div>

	<button
		type="submit"
		disabled={loading}
		class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
	>
		{loading ? 'Resetting...' : 'Reset Password'}
	</button>

	{#if message}
		<p
			class="mt-2 text-center text-sm"
			class:text-green-600={message.includes('success')}
			class:text-red-600={!message.includes('success')}
		>
			{message}
		</p>
	{/if}
</form>
