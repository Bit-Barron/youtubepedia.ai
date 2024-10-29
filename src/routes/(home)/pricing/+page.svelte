<script lang="ts">
	import { Check } from 'lucide-svelte';

	const plans = [
		{
			name: 'Basic',
			price: 9.99,
			features: ['Analyze up to 10 videos per month', 'Basic question answering', 'Email support'],
			recommended: false
		},
		{
			name: 'Pro',
			price: 19.99,
			features: [
				'Analyze up to 50 videos per month',
				'Advanced question answering',
				'Priority email support',
				'Custom video summaries'
			],
			recommended: true
		},
		{
			name: 'Enterprise',
			price: 49.99,
			features: [
				'Unlimited video analysis',
				'Advanced AI-powered insights',
				'24/7 priority support',
				'Custom integrations',
				'Dedicated account manager'
			],
			recommended: false
		}
	];
</script>

<div class="min-h-screen bg-gray-900 text-gray-100">
	<main class="container mx-auto px-4 py-16">
		<h1 class="mb-4 text-center text-4xl font-bold">Choose Your Plan</h1>
		<p class="mb-12 text-center text-xl text-gray-400">
			Unlock the power of video analysis with our flexible pricing options
		</p>

		<div class="grid gap-8 md:grid-cols-3">
			{#each plans as plan}
				<div
					class="overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-transform duration-300 hover:scale-105"
				>
					<div class="p-6">
						<h2 class="mb-2 text-2xl font-bold">{plan.name}</h2>
						<p class="mb-6 text-4xl font-bold">
							${plan.price}<span class="text-lg font-normal text-gray-400">/month</span>
						</p>
						<ul class="mb-6">
							{#each plan.features as feature}
								<li class="mb-3 flex items-center">
									<Check class="mr-2 h-5 w-5 text-green-500" />
									<span>{feature}</span>
								</li>
							{/each}
						</ul>
					</div>
					<div class="bg-gray-700 p-6">
						<button
							class="w-full rounded-full bg-red-500 px-4 py-2 font-bold transition-colors duration-200 hover:bg-red-600"
						>
							{plan.recommended ? 'Start Free Trial' : 'Choose Plan'}
						</button>
					</div>
					{#if plan.recommended}
						<div
							class="absolute right-0 top-0 rounded-bl-lg bg-red-500 px-4 py-1 font-bold text-white"
						>
							Recommended
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<div class="mt-16 text-center">
			<h2 class="mb-4 text-2xl font-bold">Need a custom solution?</h2>
			<p class="mb-6 text-gray-400">
				We offer tailored plans for large organizations and special use cases.
			</p>
			<a
				href="/contact"
				class="inline-block rounded-full bg-red-500 px-6 py-2 font-bold transition-colors duration-200 hover:bg-red-600"
			>
				Contact Sales
			</a>
		</div>
	</main>
</div>

<style>
	/* Add any additional component-specific styles here */
</style>
