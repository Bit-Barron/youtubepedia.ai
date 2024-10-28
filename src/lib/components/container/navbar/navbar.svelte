<script>
	import { Home, DollarSign, Mail, LogIn } from 'lucide-svelte';
	import { goto } from '$app/navigation';
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
	<button
		on:click={() => goto('/login')}
		class="flex items-center rounded-full bg-red-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-600"
	>
		<LogIn class="mr-2 h-4 w-4" /> Log In
	</button>
</header>
