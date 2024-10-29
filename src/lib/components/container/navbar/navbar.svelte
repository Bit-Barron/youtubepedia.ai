<script lang="ts">
	import { Home, DollarSign, Mail, LogIn, LogOut } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	export let data;
</script>

<header class="flex items-center justify-between p-4">
	<nav class="flex space-x-4">
		<button class="flex items-center text-white transition-colors duration-200 hover:text-red-400">
			<Home class="mr-2 h-4 w-4" /> Guide
		</button>
		<button class="flex items-center text-white transition-colors duration-200 hover:text-red-400">
			<DollarSign class="mr-2 h-4 w-4" /> Pricing
		</button>
		<button class="flex items-center text-white transition-colors duration-200 hover:text-red-400">
			<Mail class="mr-2 h-4 w-4" /> Contact
		</button>
	</nav>

	{#if data.user}
		<div class="flex items-center space-x-4">
			<span class="text-white">{data.user.email}</span>
			<form action="/logout" method="POST">
				<button
					type="submit"
					class="flex items-center rounded-full bg-red-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-600"
				>
					<LogOut class="mr-2 h-4 w-4" /> Log Out
				</button>
			</form>
		</div>
	{:else}
		<button
			on:click={() => goto('/login')}
			class="flex items-center rounded-full bg-red-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-600"
		>
			<LogIn class="mr-2 h-4 w-4" /> Log In
		</button>
	{/if}
</header>
