<script>
	import { page } from '$app/stores';
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8 text-center">
		{#if $page.status === 404}
			<div>
				<h1 class="mb-2 text-6xl font-extrabold text-red-500">404</h1>
				<h2 class="mb-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
				<p class="mb-8 text-gray-600">Sorry, we couldn't find the page you're looking for.</p>
			</div>
		{:else}
			<div>
				<h1 class="mb-2 text-6xl font-extrabold text-red-500">{$page.status}</h1>
				<h2 class="mb-4 text-3xl font-bold text-gray-900">Oops! Something went wrong</h2>
				<p class="mb-8 text-gray-600">
					{$page.error?.message || 'An unexpected error occurred'}
				</p>
			</div>
		{/if}

		<div class="space-y-4">
			<a
				href="/"
				class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-5 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Go back home
			</a>
			<button
				on:click={() => window.history.back()}
				class="block w-full px-5 py-3 text-center text-base font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Go back to previous page
			</button>
		</div>
	</div>
</div>
