<script lang="ts">
	import { Home, DollarSign, Mail, LogIn, LogOut, Menu } from 'lucide-svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { fly } from 'svelte/transition';

	export let data;

	let isMenuOpen = false;

	async function handleLogout() {
		const response = await fetch('/api/logout', {
			method: 'POST'
		});

		if (response.ok) {
			await invalidateAll();
			goto('/');
		}
	}

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<header class="bg-gray-900 shadow-lg">
	<div class="container mx-auto flex items-center justify-between px-4 py-4">
		<div class="flex items-center">
			<a
				href="/"
				class="text-2xl font-bold text-red-500 transition-colors duration-200 hover:text-red-400"
			>
				Youtubepedia
			</a>
		</div>

		<nav class="hidden space-x-6 md:flex">
			<a
				href="/"
				class="flex items-center text-gray-300 transition-colors duration-200 hover:text-red-400"
			>
				<Home class="mr-2 h-4 w-4" /> Home
			</a>
			<a
				href="/pricing"
				class="flex items-center text-gray-300 transition-colors duration-200 hover:text-red-400"
			>
				<DollarSign class="mr-2 h-4 w-4" /> Pricing
			</a>
			<a
				href="/contact"
				class="flex items-center text-gray-300 transition-colors duration-200 hover:text-red-400"
			>
				<Mail class="mr-2 h-4 w-4" /> Contact
			</a>
		</nav>

		<div class="hidden items-center space-x-4 md:flex">
			{#if data.user}
				<span class="text-gray-300">{data.user.email}</span>
				<button
					on:click={handleLogout}
					class="flex items-center rounded-full bg-red-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-600"
				>
					<LogOut class="mr-2 h-4 w-4" /> Log Out
				</button>
			{:else}
				<a
					href="/login"
					class="flex items-center rounded-full bg-red-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-600"
				>
					<LogIn class="mr-2 h-4 w-4" /> Log In
				</a>
			{/if}
		</div>

		<button
			class="text-gray-300 transition-colors duration-200 hover:text-red-400 md:hidden"
			on:click={toggleMenu}
		>
			<Menu class="h-6 w-6" />
		</button>
	</div>

	{#if isMenuOpen}
		<div class="md:hidden" transition:fly={{ y: -50, duration: 300 }}>
			<nav class="flex flex-col space-y-4 bg-gray-800 p-4">
				<a
					href="/"
					class="flex items-center text-gray-300 transition-colors duration-200 hover:text-red-400"
				>
					<Home class="mr-2 h-4 w-4" /> Home
				</a>
				<a
					href="/pricing"
					class="flex items-center text-gray-300 transition-colors duration-200 hover:text-red-400"
				>
					<DollarSign class="mr-2 h-4 w-4" /> Pricing
				</a>
				<a
					href="/contact"
					class="flex items-center text-gray-300 transition-colors duration-200 hover:text-red-400"
				>
					<Mail class="mr-2 h-4 w-4" /> Contact
				</a>
				{#if data.user}
					<span class="text-gray-300">{data.user.email}</span>
					<button
						on:click={handleLogout}
						class="flex items-center rounded-full bg-red-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-600"
					>
						<LogOut class="mr-2 h-4 w-4" /> Log Out
					</button>
				{:else}
					<a
						href="/login"
						class="flex items-center rounded-full bg-red-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-600"
					>
						<LogIn class="mr-2 h-4 w-4" /> Log In
					</a>
				{/if}
			</nav>
		</div>
	{/if}
</header>
